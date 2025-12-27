import React from 'react';
import { motion as Motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`premium-card p-6 ${hover ? 'hover:shadow-2xl hover:shadow-black/50' : ''} ${className}`}
            {...props}
        >
            {children}
        </Motion.div>
    );
};

export default Card;
