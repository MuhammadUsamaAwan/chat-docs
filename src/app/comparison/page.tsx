import { Separator } from '~/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Icons } from '~/components/icons';
import { SiteHeader } from '~/components/layouts/site-header';

const Tick = () => <Icons.check className='h-5 w-5 text-green-500' />;

const Cross = () => <Icons.x className='h-5  w-5 text-red-500' />;

const features = [
  {
    feature: 'Works without an internet connection',
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: 'Free to use',
    chatDocs: true,
    chatGPT3: true,
    chatGPT4: false,
  },
  {
    feature: 'Allows file uploads',
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: true,
  },
  {
    feature: 'Supports almost all document types',
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: 'Unlimited messages per day',
    chatDocs: true,
    chatGPT3: true,
    chatGPT4: false,
  },
  {
    feature: 'Unlimited document size',
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: "Doesn't hallucinate with large content",
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: 'Allows fine-tuning',
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: 'Knowledge update through documents',
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: 'Is unbiased in responses',
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: "Doesn't censor content",
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
  {
    feature: "Doesn't collect your data",
    chatDocs: true,
    chatGPT3: false,
    chatGPT4: false,
  },
];

export default function ComparisonPage() {
  return (
    <>
      <SiteHeader />
      <main className='container py-8'>
        <h1 className='text-2xl font-bold'>Comparison</h1>
        <Separator className='mt-2.5' />
        <section className='py-10'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>ChatDocs</TableHead>
                <TableHead>ChatGPT 4</TableHead>
                <TableHead>ChatGPT 3.5</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map(({ feature, chatDocs, chatGPT3, chatGPT4 }) => (
                <TableRow key={feature}>
                  <TableCell>{feature}</TableCell>
                  <TableCell>{chatDocs ? <Tick /> : <Cross />}</TableCell>
                  <TableCell>{chatGPT4 ? <Tick /> : <Cross />}</TableCell>
                  <TableCell>{chatGPT3 ? <Tick /> : <Cross />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </>
  );
}
