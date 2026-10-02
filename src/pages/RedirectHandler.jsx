import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { request } from '../utils/api/client';
import PublicBioPage from '../components/bio/PublicBioPage';
import { Loader2, Zap } from 'lucide-react';



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
                const { data, error } = await request(`/api/resolve/${encodeURIComponent(slug)}`, { referrer: document.referrer });
                if (!error && data?.type === 'link') {
                    window.location.replace(data.page.original_url);
                    return;
                }
                if (!error && data?.type === 'bio') {
                    setPageData(data.page);
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
