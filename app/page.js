"use client"
import { FaBrain, FaChartBar, FaFileUpload } from "react-icons/fa";
import {useRef, useState} from "react";
import {motion} from "framer-motion"
import { FaFilePdf } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { ImCross } from "react-icons/im";
export default function Home() {
  const fileInputRef=useRef(null);
  const [file,setFile]=useState(null);
  const [fileURL,setFileURL]=useState(null);
  const [analysis,setAnalysis]=useState(null);
  const [error,setError]=useState(null);
  const [jobrole,setJobRole]=useState(null);
  const [experience,setExperience]=useState(null);
  const [description,setDescription]=useState(null);
  const handleClick=()=>{
    fileInputRef.current.click();
  }

async function extractText(file) {
   const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");

  const arrayBuffer = await file.arrayBuffer();

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map(item => item.str || "");
    text += strings.join(" ");
  }

  return text;
}
  const handleFileChange=(e)=>{
    /*
    This function sets the file state to the uploaded file and creates a object URl which can 
    be used later to provide preview option for our user to see their uploaded file.
    */
    const selectedfile=e.target.files[0];
    if(selectedfile){
      setError(null);
      setFile(selectedfile);
      setFileURL(URL.createObjectURL(selectedfile));
    }
  }
  const handleAnalysis=async ()=>{
    if(!file){
      return;// if there is no file then just simply return
    }
    /*
    FormData() - this is a container for key-value pairs and is used to send data to our backend API's.
    We have made a API directory - api/parse-pdf which takes users uploaded pdf and extract text from 
    it, this text is then further send to our AI model to get a resume feedback.
    For sending the resume we have been using a POST API
    Once the API gives us a response - text, the text is sent to the analyzeResume() service which sends 
    the text to GEMINI model and we await a response from the model once we gets it we set the analyis
    state to the generated analysis.
    */
    try{
      setError(null);
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Client-side parsing only supports PDF files right now.');
      }

      const text = await extractText(file);
      if (!text.trim()) {
        throw new Error('Unable to extract text from the selected PDF.');
      }

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          jobrole,
          experience,
          description,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze resume');
      }

      setAnalysis(result);
    }
    catch(error){
      setError(error?.message || 'Error happened while analysing resume')
      setAnalysis(null)
      console.error('Resume analysis error:', error)
    }
  }
  const clearSelection=(e)=>{
    e.stopPropagation();
    setFile(null);
    setFileURL(null);
    setAnalysis(null);
    setError(null);
    setJobRole(null);
    setDescription(null);
    setExperience(null);
  }
  return (
    <div className="main bg-linear-to-br from-purple-900 via-purple-800 to-black">
      <nav>
        <span>Resume Analyzer</span>
        <ul>
          <li>Home</li>
          <li>About Us</li>
        </ul>
        <button className="nav-btn">Try Now</button>
      </nav>
      <div className="hero-section mt-25px text-center text-white">
        <h2 className="hero-heading">Get Your Resume Analyzed Instantly</h2>
        <p>Improve your ATS score, optimize keywords, and get actionable insights to land more interviews.</p>
        {error && (
          <p className="text-red-400 mt-4 font-semibold">{error}</p>
        )}
      </div>
      {!file ? (
      <motion.div
        initial={{opacity:0,y:50}}
        animate={{opacity:1,y:0}}
        transition={{duration:2}}
        className="flex justify-center mt-16 px-4"
      >
      <div className="flex flex-row gap-5 mt-[80px]">
        <div className="exp-details flex flex-col justify-center items-center">
          <div className="flex flex-col">
          <label htmlFor="role" className="text-white font-semibold">Enter Your Job Role</label>
          <input type="text" placeholder="Enter Job role" id="role" className="w-74 border-2 border-purple-400 p-3 rounded-2xl mt-3 mb-3 outline-none placeholder-gray-300 text-white" onChange={(e)=>{setJobRole(e.target.value)}}></input>
          </div>
          <div className="flex flex-col">
          <label htmlFor="exp" className="text-white font-semibold">Enter Job Experience</label>
          <input type="text" placeholder="Enter work experience in years" id="role" className="w-74 border-2 border-purple-400 p-3 rounded-2xl mt-3 mb-3 outline-none placeholder-gray-300 text-white" onChange={(e)=>{setExperience(e.target.value)}}></input>
          </div>
          <div className="flex flex-col">
          <label htmlFor="desc" className="text-white font-semibold">Paste Job Description</label>
          <textarea rows={5} cols={10} id="desc" placeholder="Job Description..." className="w-74 p-3 rounded-2xl mt-3 mb-3 outline-none border border-white/20 bg-white/5 text-white placeholder-white/50 resize-none" onChange={(e)=>{setDescription(e.target.value)}}></textarea>
          </div>
        </div>
        <div className="upload-body bg-white/5 backdrop-blur-lg" onClick={handleClick}>
          <span className="upload-icon"><FaFileUpload/></span>
          <p className="font-bold text-[20px]">Drag and Drop your Resume</p>
          <p className="sub-text">PDF file only for client-side parsing</p>
          <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        </div>
      </div>
      </motion.div>
      ):(
      <motion.div
        initial={{opacity:0,y:50}}
        animate={{opacity:1,y:0}}
        transition={{duration:2}}
      >
      <div className="view-body bg-white/5 backdrop-blur-lg">
        <p className=" text-green-500 text-2xl font-bold">✅ File Uploaded</p>
            <span className="text-[50px] text-red-500"><FaFilePdf/></span>
            <p>{file.name}</p>
            <p>{file.type}</p>
            <div className="flex flex-row border-2 px-5 py-3 w-full items-center font-semibold text-[20px] justify-center rounded-2xl cursor-pointer"><a href={fileURL} target="_blank" rel="noopener noreferr" onClick={(e)=>{e.stopPropagation()}} className="flex items-center gap-2 font-semibold"><div className="text-white"><FaEye/></div>Preview Resume</a></div>
            <button onClick={handleAnalysis} className="flex flex-row border-2 px-5 py-3 w-full items-center font-semibold text-[20px] justify-center rounded-2xl gap-2 cursor-pointer bg-purple-400"><span><FaChartBar/></span>{!analysis ? "Analyze Resume":"Resume Analysis Complete"}</button>
            <button className="flex flex-row border-2 px-5 py-3 w-full items-center font-semibold text-[20px] justify-center rounded-2xl gap-2 cursor-pointer bg-red-500" onClick={clearSelection}><span><ImCross/></span>Clear Selection</button>
      </div>
      </motion.div>
      )}
      {
        analysis && (
        <div className="grid grid-cols-3 mt-10">
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition">
            <h3 className="text-white text-2xl font-semibold">Score</h3>
            <p className="text-green-600 text-[25px] font-semibold">{analysis.score}/100</p>
            <h3 className="text-white text-2xl font-semibold">ATS Score</h3>
            <p className="text-green-600 text-[25px] font-semibold">{analysis.ATSSCORE}/100</p>
            <h3 className="text-white text-2xl font-semibold">Projects Score</h3>
            <p className="text-green-600 text-[25px] font-semibold">{analysis.Projects}/100</p>
            <h3 className="text-white text-2xl font-semibold">Experience Score</h3>
            <p className="text-green-600 text-[25px] font-semibold">{analysis.Experience}/100</p>
          </div>
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition">
            <h3 className="text-white text-2xl font-semibold">Strengths</h3>
            <p className="text-green-400 text-[15px]">{analysis.strengths}</p>
          </div>
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition">
            <h3 className="text-white text-2xl font-semibold">Limitations</h3>
            <p className="text-red-500 text-[15px]">{analysis.limitations}</p>
          </div>
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition">
            <h3 className="text-white text-2xl font-semibold">Flow Order</h3>
            <p className="text-green-400 text-[15px]">{analysis.flowOrder}</p>
          </div>
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition">
            <h3 className="text-white text-2xl font-semibold">Suggestions</h3>
            <p className="text-green-400 text-[15px]">{analysis.suggestions}</p>
          </div>
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition">
            <h3 className="text-white text-2xl font-semibold">Keyword Optimization</h3>
            <p className="text-green-400 text-[15px]">{analysis.suggestions}</p>
          </div>
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition">
            <h3 className="text-white text-2xl font-semibold">Top 3 improvements:</h3>
            <p className="text-green-400 text-[15px]">{analysis.topfixes}</p>
          </div>
        </div>)
      }
      <div className="grid grid-cols-3 mt-20">
        {[
          {
            title:"ATS Score",
            desc:"Know how well your resume performs in ATS systems"
          },
          {
            title:"Keyword Optimization",
            desc:"Get suggestions to improve keyword matching"
          },
          {
            title:"Smart Feedback",
            desc:"Receive actionable improvements instantly"
          }
        ].map((item,index)=>(
          <div className="bg-white/5 m-20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition" key={index}>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="footer-msg text-gray-400 text-center">
        🔒 Your data is secure. Files are not stored.
      </div>
      <div className="text-gray-400 text-center mb-10 mt-10">
        © 2026 ResumeAI. All rights reserved.
      </div>
    </div>
  );
}
