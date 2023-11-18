interface HeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, ...props }) => {
  return (
    <div {...props}>
      <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
      <p className='text-sm text-muted-foreground py-2'>{description}</p>
    </div>
  );
};
