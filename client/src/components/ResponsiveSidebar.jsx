// ResponsiveSidebar.jsx
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const APP_NAME = "LexNova AI";

const SidebarDemo = () => {
  const pages = [
    { 
      label: "Compliance validator", 
      href: "/compliance-validator", 
      icon: <img src="https://cdn-icons-png.flaticon.com/128/18564/18564698.png" className="h-6 w-6" alt="Conflict Management" />
    },
    // { 
    //   label: "Contract Analysis", 
    //   href: "/contract-analysis", 
    //   icon: <img src="https://cdn-icons-png.flaticon.com/128/17773/17773157.png" className="h-6 w-6" alt="Contract Analysis" />
    // },
    // { 
    //   label: "Case Research", 
    //   href: "/case-research", 
    //   icon: <img src="https://cdn-icons-png.flaticon.com/128/18290/18290038.png" className="h-6 w-6" alt="Case Research" />
    // },
    { 
      label: "Document Creator", 
      href: "/create", 
      icon: <img src="https://cdn-icons-png.flaticon.com/128/4252/4252360.png" className="h-6 w-6" alt="Document Creator" />
    },
    { 
      label: "Legal Drafting", 
      href: "/legal-drafting", 
      icon: <img src="https://cdn-icons-png.flaticon.com/128/18570/18570180.png" className="h-6 w-6" alt="Legal Drafting" />
    },
    { 
      label: "Document Summarizer", 
      href: "/document-summarizer", 
      icon: <img src="https://cdn-icons-png.flaticon.com/128/16493/16493824.png" className="h-6 w-6" alt="Document Summarizer" />
    },
    { 
      label: "News", 
      href: "/news", 
      icon: <img src="https://cdn-icons-png.flaticon.com/128/2965/2965879.png" className="h-6 w-6" alt="News" />
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <Sidebar 
      open={open} 
      setOpen={setOpen}
      className="bg-gradient-to-b from-blue-600 to-indigo-700 shadow-md"
    >
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {pages.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={{
                  ...link,
                  label: <span className="text-base">{link.label}</span>
                }}
                className="text-white hover:bg-blue-500/30 rounded-lg"
              />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: APP_NAME,
              href: "#",
              icon: (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2235/2235057.png"
                  className="h-8 w-8 shrink-0 rounded-full border-2 border-white/30"
                  width={50}
                  height={50}
                  alt={APP_NAME}
                />
              ),
            }}
            className="text-white"
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

const Logo = () => (
    <Link
      to="/"
      className="relative z-20 flex items-center space-x-3 py-2 text-lg font-bold text-blue-700 dark:text-white"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/2235/2235057.png"
        alt="LexNova Logo"
        className="h-7 w-7 rounded-md object-contain"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-nowrap tracking-wide"
      >
        {APP_NAME}
      </motion.span>
    </Link>
  );
  
  
  
  const LogoIcon = () => (
    <Link to="/" className="relative z-20 flex items-center py-2">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2235/2235057.png"
        alt="LexNova Logo"
        className="h-7 w-7 rounded-md object-contain"
      />
    </Link>
  );
  

export default SidebarDemo;