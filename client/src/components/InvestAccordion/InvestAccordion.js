import React from 'react';
import "./InvestAccordion.css";
import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';

const InvestAccordion = props => (
    <div className="mt-4 p-3">
        <Accordion atomic={true}>

            <AccordionItem title="Investment 1">
                <div className="bg-white content-font">Some stock stuff</div>
            </AccordionItem>

            <AccordionItem title="Investment 2">
                <div className="bg-white content-font">Some stock stuff</div>
            </AccordionItem>

        </Accordion>
    </div>
);


export default InvestAccordion