import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';

type Program = {
  image: string;
  title: string;
  content: string;
};

const ProgramCards = () => {
  const programData: Program[] = [
    {
      image: 'program-prestartup.jpg',
      title: 'Prestartup & Discovery',
      content:
        'Indigo Prestartup & Discovery berfokus pada penguatan ide untuk mendapatkan MVP yang divalidasi oleh pelanggan.',
    },
    {
      image: 'program-incubation.jpg',
      title: 'Incubation',
      content: 'Program pembinaan startup untuk menghasilkan product market fit melalui validasi produk dan model bisnis.',
    },
    {
      image: 'program-game-incubation.jpg',
      title: 'Indigo Game Startup Incubation',
      content: 'Program inkubasi khusus untuk startup game hingga mencapai tahap peluncuran produk.',
    },
    {
      image: 'program-acceleration.jpg',
      title: 'Acceleration',
      content: 'Program pembinaan untuk startup tahap pre-seed dan seed yang berfokus pada scaling bisnis dan pendanaan dari VC.',
    },
  ];

  return programData.map((program, index) => (
    <Card
      key={index}
      className='rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto hover:shadow-xl transition-all duration-200'
    >
      <Image
        src={`/${program.image}`}
        width='200'
        height='50'
        alt={`${program.image}`}
        style={{
          width: '100%',
          aspectRatio: '320/320',
          objectFit: 'cover',
        }}
      />
      <CardContent className='text-left p-4'>
        <h2 className='text-xl font-bold'>
          {program.title}
        </h2>
        <p className='mt-2 text-gray-600'>
          {program.content}
        </p>
      </CardContent>
    </Card>
  ));
};

export default ProgramCards;
