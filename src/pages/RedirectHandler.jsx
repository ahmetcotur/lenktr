import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '../utils/supabase/client';
import PublicBioPage from '../components/bio/PublicBioPage';
import { Loader2, Zap } from 'lucide-react';

const supabase = createClient();

const RedirectHandler = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(null);
    const [type, setType] = useState(null); // 'link' or 'bio'

    useEffect(() => {
        const handleRedirect = async () => {
            if (!slug) return;

            setLoading(true);
            try {
                // 1. Check Links Table
                const { data: link, error: linkError } = await supabase
                    .from('links')
                    .select('*')
                    .eq('short_slug', slug)
                    .single();

                if (link && !linkError) {
                    // It's a short link redirect
                    // 1. Increment clicks (asyncly)
                    supabase
                        .from('links')
                        .update({ clicks: (link.clicks || 0) + 1 })
                        .eq('id', link.id)
                        .then();

                    // 2. Log traffic (asyncly)
                    supabase
                        .from('traffic_logs')
                        .insert([{
                            user_id: link.user_id,
                            link_id: link.id,
                            type: 'link',
                            referrer: document.referrer || 'direct',
                            device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                            browser: navigator.userAgent.split(' ')[0]
                        }])
                        .then();

                    window.location.href = link.original_url;
                    return;
                }

                // 2. Check Bio Pages Table
                const { data: bioPage, error: bioError } = await supabase
                    .from('bio_pages')
                    .select('*')
                    .eq('slug', slug)
                    .eq('is_published', true) // Only fetch published pages
                    .single();

                if (bioPage && !bioError) {
                    // It's a bio page
                    // 1. Increment views (asyncly)
                    supabase
                        .from('bio_pages')
                        .update({ views: (bioPage.views || 0) + 1 })
                        .eq('id', bioPage.id)
                        .then();

                    // 2. Log traffic (asyncly)
                    supabase
                        .from('traffic_logs')
                        .insert([{
                            user_id: bioPage.user_id,
                            bio_page_id: bioPage.id,
                            type: 'bio',
                            referrer: document.referrer || 'direct',
                            device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                            browser: navigator.userAgent.split(' ')[0]
                        }])
                        .then();

                    setPageData(bioPage);
                    setType('bio');
                    setLoading(false);
                    return;
                }

                // 3. Not Found
                navigate('/', { replace: true });

            } catch (err) {
                console.error('Redirection error:', err);
                navigate('/', { replace: true });
            } finally {
                // We keep loading true if it's a redirect to prevent flash
            }
        };

        handleRedirect();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-8">
                <div className="relative">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center">
                        <Loader2 className="text-blue-500 animate-spin" size={40} />
                    </div>
                </div>
                <p className="mt-8 text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">
                    Loading...
                </p>
            </div>
        );
    }

    if (type === 'bio') {
        return <PublicBioPage pageData={pageData} />;
    }

    return null;
};

export default RedirectHandler;
