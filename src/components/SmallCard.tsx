import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

interface SmallCardProps {
  Icon: LucideIcon;
  color: string;
  title: string;
  content: string | undefined;
}

const SmallCard: FC<SmallCardProps> = ({ Icon, color, title, content }) => {
  return (
    <Card className='flex flex-row items-center'>
      <CardHeader>
        <div className={cn('p-4 rounded-full', color)}>
          <Icon />
        </div>
      </CardHeader>
      <CardContent className='text-left p-0'>
        <p className='font-bold text-2xl'>{content}</p>
        <CardTitle className='text-sm text-muted-foreground'>{title}</CardTitle>
      </CardContent>
    </Card>
  );
};

export default SmallCard;
