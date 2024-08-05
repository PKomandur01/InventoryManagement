import dynamic from 'next/dynamic';

const DynamicHome = dynamic(() => import('./page'), { ssr: false });

export default DynamicHome;
