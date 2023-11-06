import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  BarChart2,
  Building,
  CircleDollarSign,
  LucideIcon,
  Presentation,
  Users2,
} from 'lucide-react';

type Benefit = {
  icon: LucideIcon;
  title: string;
  content: string;
};

const BenefitCards = () => {
  const benefitData: Benefit[] = [
    {
      icon: Presentation,
      title: 'Mentoring',
      content: 'Bimbingan dan konsultasi dari 50+ mentor yang berpengalaman',
    },
    {
      icon: CircleDollarSign,
      title: 'Funding',
      content: 'Raih peluang mendapatkan pendanaan hingga Rp 2 Miliar',
    },
    {
      icon: Users2,
      title: 'Telkom Group Digital Platform',
      content: 'Kesempatan untuk berkolaborasi dengan PT Telkom Indonesia',
    },
    {
      icon: BarChart2,
      title: 'Global VC & Support',
      content:
        'Menjembatani startup untuk mendapatkan pendanaan dari Venture Capital berskala global',
    },
    {
      icon: Building,
      title: 'Coworking Space',
      content:
        'Akses ke Coworking Space Indigo (Indigo Hub dan Indigo Space) di seluruh Indonesia',
    },
  ];

  return benefitData.map((benefit, index) => (
    <Card key={index} className='-space-y-4 pt-6 flex flex-col items-center'>
      <benefit.icon color='red' className='mb-2' />
      <CardHeader>
        <CardTitle className='font-semibold'>{benefit.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm'>{benefit.content}</p>
      </CardContent>
    </Card>
  ));
};

export default BenefitCards;
