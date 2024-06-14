import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Template1 from "./Template1";
import Template2 from "./Template2";
import { forwardRef } from "react";
// import { useReactToPrint } from 'react-to-print';
// import { useRef } from 'react';

const PreviewCV = forwardRef((props, ref) => {
  const { selectedResume, selectedTemplate } = useSelector(
    (state) => state.resume
  );
  //   const dispatch = useDispatch();
  //   const handlePrint = useReactToPrint({
  //     content: () => componentRef.current,
  //   });

  console.log("~ selectedTemplate", selectedTemplate);
  console.log("~ selectedResume", selectedResume);
  return (
    <>
      {/* <button onClick={handlePrint}>Print this out!</button> */}
      {(selectedTemplate === 1 ) && (
        <Template1 data={selectedResume} ref={ref} />
      )}
      {(selectedTemplate === 2 ) && (
        <Template2 data={selectedResume} ref={ref} />
      )}
    </>
  );
});

export default PreviewCV;
