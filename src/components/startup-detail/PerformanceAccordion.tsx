import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { cn } from '@/lib/utils';
import { Performance } from '@prisma/client';
import Link from 'next/link';
import { FC } from 'react';
import { buttonVariants } from '../ui/Button';

interface PerformanceAccordionProps {
  data: Performance[];
  editUrl: string;
}

const PerformanceAccordion: FC<PerformanceAccordionProps> = ({
  data,
  editUrl,
}) => {
  const parseMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  const isHtmlContent = (content: string) => /<\/?[a-z][\s\S]*>/i.test(content);

  return (
    <>
      {data.map((item) => (
        <div key={item.id}>
          <div className='flex flex-row items-center justify-between pt-4'>
            <h1 className='font-bold text-lg'>Performance {item.year}</h1>
            <Link
              href={editUrl + `/performance?id=${item.id}`}
              className={cn(
                buttonVariants(),
                'bg-tertiary hover:bg-tertiary hover:opacity-90'
              )}
            >
              Edit
            </Link>
          </div>
          <Accordion type='single' collapsible>
            {item.performance_update && (
              <AccordionItem value={`performance-update-${item.year}`}>
                <AccordionTrigger>Performance Update</AccordionTrigger>
                <AccordionContent>
                  {isHtmlContent(item.performance_update) ? (
                    <div
                      dangerouslySetInnerHTML={parseMarkup(
                        item.performance_update
                      )}
                    />
                  ) : (
                    <p>{item.performance_update}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
            {item.people_update && (
              <AccordionItem value={`people-update-${item.year}`}>  
                <AccordionTrigger>People Update</AccordionTrigger>
                <AccordionContent>
                  {isHtmlContent(item.people_update) ? (
                    <div
                      dangerouslySetInnerHTML={parseMarkup(
                        item.people_update
                      )}
                    />
                  ) : (
                    <p>{item.people_update}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
            {item.product_update && (
              <AccordionItem value={`product-update-${item.year}`}>
                <AccordionTrigger>Product Update</AccordionTrigger>
                <AccordionContent>
                  {isHtmlContent(item.product_update) ? (
                    <div
                      dangerouslySetInnerHTML={parseMarkup(
                        item.product_update
                      )}
                    />
                  ) : (
                    <p>{item.product_update}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
            {item.action_plan && (
              <AccordionItem value={`action-plan-${item.year}`}>
                <AccordionTrigger>Action Plan</AccordionTrigger>
                <AccordionContent>
                  {isHtmlContent(item.action_plan) ? (
                    <div
                      dangerouslySetInnerHTML={parseMarkup(
                        item.action_plan
                      )}
                    />
                  ) : (
                    <p>{item.action_plan}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      ))}
    </>
  );
};

export default PerformanceAccordion;

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// const MyAccordionComponent = ({ data }) => {
//   const createMarkup = (htmlContent) => {
//     return { __html: htmlContent };
//   };

//   const isHtmlContent = (content) => /<\/?[a-z][\s\S]*>/i.test(content);

//   return (
//     <>
//       {data.Performance.map((performanceYear) => (
//         <div key={performanceYear.id}>
//           <h2>Performance {performanceYear.year}</h2>
//           <Accordion type="single" collapsible>
//             {performanceYear.performance_update && (
//               <AccordionItem value={`performance-update-${performanceYear.year}`}>
//                 <AccordionTrigger>Performance Update</AccordionTrigger>
//                 <AccordionContent>
//                   {isHtmlContent(performanceYear.performance_update)
//                     ? <div dangerouslySetInnerHTML={createMarkup(performanceYear.performance_update)} />
//                     : <p>{performanceYear.performance_update}</p>}
//                 </AccordionContent>
//               </AccordionItem>
//             )}
//             {/* Repeat for other update types */}
//           </Accordion>
//         </div>
//       ))}
//     </>
//   );
// };

// export default MyAccordionComponent;

// export default MyAccordionComponent;
