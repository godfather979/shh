import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import data from "../lib/data.json";
import { FieldGuidanceModal } from "@/components/FieldGuidanceModal";
import { getFieldGuidance } from "@/lib/gemini";
import { InfoIcon } from "lucide-react";
import { motion } from "framer-motion";


export default function CreateForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = location.state || {};
  const [selectedField, setSelectedField] = useState(null);
  const [fieldGuidance, setFieldGuidance] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formData = data[category];

  if (!formData) {
    return <div>No form data found for this category.</div>;
  }

  const handleInfoClick = async (fieldName) => {
    setSelectedField(fieldName);
    const guidance = await getFieldGuidance(
      fieldName,
      formData.title,
      formData.description
    );
    setFieldGuidance(guidance);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    navigate(`${location.pathname}/text-editor`, { state: { formValues, category } });
  };

  const fieldPairs = [];
  for (let i = 0; i < formData.fields.length; i += 2) {
    fieldPairs.push(formData.fields.slice(i, i + 2));
  }




return (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="container mx-auto px-10 py-10"
  >
    <motion.h1 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-4xl font-bold text-center mb-10"
    >
      {formData.title}
    </motion.h1>
    
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-lg text-center mb-10"
    >
      {formData.description}
    </motion.p>
    
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-6" 
      onSubmit={handleSubmit}
    >
      {fieldPairs.map((pair, rowIndex) => (
        <motion.div 
          key={rowIndex} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + (rowIndex * 0.1) }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {pair.map((field, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="space-y-2">
              <div className="flex items-center">
                <Label className="text-base">{field.label}</Label>
                <InfoIcon 
                  className="ml-2 w-4 h-4 text-gray-500 
                    transition-all duration-200 ease-in-out
                    hover:text-blue-600 hover:scale-110
                    active:text-blue-700 active:scale-95
                    cursor-pointer"
                  onClick={() => handleInfoClick(field.label)} 
                />
              </div>
              <Input
                name={field.label.toLowerCase().replace(/ /g, "_")}
                type={field.type}
                placeholder={field.placeholder || ""}
                required
                className="text-base transition-all duration-200 hover:shadow-lg hover:border-slate-400 focus:shadow-md border-2 "
              />
            </div>
          ))}
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button type="submit" className="w-full mt-6 text-base">
          Submit
        </Button>
      </motion.div>
    </motion.form>

    <FieldGuidanceModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      fieldName={selectedField}
      guidance={fieldGuidance}
    />
  </motion.div>
);
}