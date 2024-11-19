import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "../App.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import companies from "../data/companies.json";
import faqData from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-6 sm:gap-10 py-8 px-4 sm:px-10 lg:gap-20 lg:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-3xl sm:text-5xl lg:text-8xl tracking-tighter py-4">
          Forge Your Dream Career
          <span className="flex items-center gap-1 sm:gap-4 lg:gap-6">
            with
            <img
              src="/logo.png"
              className="h-10 sm:h-16 lg:h-32 mt-4  "
              alt="Hirrd Logo"
            />
          </span>
        </h1>
        <p className="text-gray-300 mt-2 sm:mt-4 text-xs sm:text-lg lg:text-xl px-2 sm:px-0">
        Browse thousands of jobs or connect with the talent that fits your vision
        </p>
      </section>

      {/* Responsive Button Section */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-4 sm:mt-8">
        <Link to={"/jobs"} className="w-full sm:w-auto">
          <Button
            variant="blue"
            size="xl"
            className="w-full sm:w-auto text-sm sm:text-lg"
          >
            Find Jobs
          </Button>
        </Link>
        <Link to={"/post-jobs"} className="w-full sm:w-auto">
          <Button
            variant="destructive"
            size="xl"
            className="w-full sm:w-auto text-sm sm:text-lg"
          >
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Responsive Banner Image */}
      <div className="flex justify-center mt-6 sm:mt-10">
      <img
  src="/banner.webp"
  className="w-[40%] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto rounded-xl"
  alt="Banner"
/>
      </div>

      {/* Carousel Section */}
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-6 sm:py-10"
      >
        <CarouselContent className="flex gap-2 sm:gap-6 lg:gap-20 items-center justify-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem
              key={id}
              className="flex basis-1/2 sm:basis-1/3 lg:basis-1/6 justify-center"
            >
              <img
                src={path}
                alt={name}
                className="h-8 sm:h-10 lg:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Grid Section with Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 sm:px-0">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-center sm:text-3xl">
              For Job Seekers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-center sm:text-3xl">
              For Employers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      {/* Accordion Section */}
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-2xl mx-auto my-6 space-y-4 px-4"
      >
        {faqData.faq.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="border-b border-gray-700"
          >
            <AccordionTrigger className="text-white bg-gray-900 hover:bg-gray-700 p-3 sm:p-4 rounded-md font-sans text-sm sm:text-base font-semibold focus:outline-none">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="p-3 sm:p-4 bg-gray-900 text-gray-200 rounded-md font-sans text-xs sm:text-sm">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;

{
  /* accordion */
}
{
  /* <Accordion
        type="single"
        collapsible
        className="w-full max-w-2xl mx-auto my-8 space-y-4 px-4"
      >
        {faqData.faq.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="border-b border-gray-700"
          >
            <AccordionTrigger className=" text-white bg-gray-900 hover:bg-gray-600 p-3 sm:p-4 rounded-md font-sans text-base sm:text-lg font-semibold focus:outline-none no-underline">
              <span className="no-underline">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="p-3 sm:p-4 bg-gray-900 text-gray-200 rounded-md font-sans text-sm sm:text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion> */
}
