import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ProfessionalAccord() {
  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-lg">
      <h1 className="text-slate-800 text-4xl font-copernicusMedium mb-8 text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border-none bg-white/80 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <AccordionTrigger className="hover:no-underline rounded-lg px-6 py-4 text-left font-outfitRegular text-slate-700 hover:text-slate-900 transition-colors duration-300">
            What is mental health, and why is it important?
          </AccordionTrigger>
          <AccordionContent className="mt-2 px-6 py-4 rounded-lg font-outfitRegular text-slate-600 bg-white/40 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transition-all duration-500 ease-in-out">
            Mental health encompasses emotional, psychological, and social well-being. It influences how we think, feel, and act in everyday life. Prioritizing mental health helps individuals cope with stress, maintain relationships, and improve overall quality of life.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-none bg-white/80 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <AccordionTrigger className="hover:no-underline rounded-lg px-6 py-4 text-left font-outfitRegular text-slate-700 hover:text-slate-900 transition-colors duration-300">
            How can your platform help improve mental health?
          </AccordionTrigger>
          <AccordionContent className="mt-2 px-6 py-4 rounded-lg font-outfitRegular text-slate-600 bg-white/40 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transition-all duration-500 ease-in-out">
            Our platform offers personalized assessments, actionable insights, and a variety of resources tailored to your needs. Whether you're managing stress, anxiety, or simply looking to improve your well-being, we're here to support you every step of the way.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-none bg-white/80 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <AccordionTrigger className="hover:no-underline rounded-lg px-6 py-4 text-left font-outfitRegular text-slate-700 hover:text-slate-900 transition-colors duration-300">
            Are the assessments scientifically backed?
          </AccordionTrigger>
          <AccordionContent className="mt-2 px-6 py-4 rounded-lg font-outfitRegular text-slate-600 bg-white/40 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transition-all duration-500 ease-in-out">
            Yes. All our assessments are developed in collaboration with licensed psychologists and mental health professionals. They are based on evidence-based research to ensure accuracy and reliability.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-none bg-white/80 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <AccordionTrigger className="hover:no-underline rounded-lg px-6 py-4 text-left font-outfitRegular text-slate-700 hover:text-slate-900 transition-colors duration-300">
            Is my information secure?
          </AccordionTrigger>
          <AccordionContent className="mt-2 px-6 py-4 rounded-lg font-outfitRegular text-slate-600 bg-white/40 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transition-all duration-500 ease-in-out">
            Absolutely. We prioritize your privacy and follow strict data protection protocols. All personal information and assessment results are encrypted and securely stored.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-none bg-white/80 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <AccordionTrigger className="hover:no-underline rounded-lg px-6 py-4 text-left font-outfitRegular text-slate-700 hover:text-slate-900 transition-colors duration-300">
            Can I access mental health resources for free?
          </AccordionTrigger>
          <AccordionContent className="mt-2 px-6 py-4 rounded-lg font-outfitRegular text-slate-600 bg-white/40 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down transition-all duration-500 ease-in-out">
            Yes. We provide a variety of free resources, including articles, guides, and mindfulness exercises, to help you on your mental health journey. Additional services and personalized plans are also available for a fee.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
