import { FC } from 'react';
import { SocialIcon } from 'react-social-icons';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer: FC<FooterProps> = ({ ...props }) => {
  return (
    <section {...props}>
      <div className='grid items-center gap-12 lg:grid-cols-2'>
        <div className='px-10 space-y-4 text-white text-center lg:text-left'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Indigo by Telkom Indonesia
          </h1>
          <h2 className='text-sm text-semibold'>
            Direktorat Digital Business <br />
            Telkom Landmark Tower, Jakarta Digital Valley Lantai 38 <br />
            Jalan Jenderal Gatot Subroto, Kav-52. Jakarta Selatan, Indonesia
          </h2>
        </div>
        <div className='h-full flex flex-row items-start justify-center lg:justify-end gap-2 px-10'>
          <SocialIcon url='https://www.facebook.com/indigo.telkom' target='_blank'/>
          <SocialIcon url='https://x.com/indigotelkom' target='_blank'/>
          <SocialIcon url='https://www.instagram.com/indigo.telkom' target='_blank'/>
          <SocialIcon url='https://www.linkedin.com/company/indigo-telkom' target='_blank'/>
          <SocialIcon url='https://www.youtube.com/channel/UCPgPDwXHqU9e-GcGv1PQuvA' target='_blank'/>
        </div>
      </div>
      <div className="flex flex-col items-center text-center pt-8">
        <p className='text-sm text-white'>
          © 2023 Indigo by Telkom Indonesia. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
