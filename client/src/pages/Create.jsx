import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircleIcon } from "lucide-react"
import { Link } from "react-router-dom"

const ILSI_CLASSES = [
  "Employee Bond for Non-Compete",
  "Employee Service Agreement",
  "Confidential Information and Non-Disclosure Agreement (NDA)",
  "Legal Notice for Non-Payment of Salary",
  "Legal Notice for Wrongful Termination",
  "Civil Suit for Damages Due to Breach of Contract"
]

const descriptions = {
  "Employee Bond for Non-Compete": "A legal agreement between an employer and an employee restricting the employee from engaging in competing businesses or disclosing trade secrets after employment termination.",
  "Employee Service Agreement": "A formal contract defining the terms of employment, including job role, probation, salary, work hours, benefits, and arbitration clauses.",
  "Confidential Information and Non-Disclosure Agreement (NDA)": "A legally binding agreement between two parties to protect confidential business and technical information exchanged for potential collaboration.",
  "Legal Notice for Non-Payment of Salary": "A formal legal notice sent to an employer demanding unpaid salary, reimbursement, and statutory benefits before taking legal action.",
  "Legal Notice for Wrongful Termination": "A legal notice served to an employer for unlawfully terminating an employee without proper cause, demanding reinstatement and unpaid dues.",
  "Civil Suit for Damages Due to Breach of Contract": "A civil lawsuit seeking compensation for financial losses incurred due to a party’s failure to honor a contractual agreement.",
}

export default function Create() {
  return (
    <>
      <div className="flex">
          <div className="container mx-auto px-10 py-10">
              <h1 className="text-3xl font-bold text-center mb-10">Legal Document Categories</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ILSI_CLASSES.map((category) => (
                  <Link to={`/create/${category}`} state={{ category }} key={category}>
                      <Card className="flex flex-col h-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                          <CardHeader>
                          <CardTitle>{category}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                          <CardDescription>{descriptions[category]}</CardDescription>
                          </CardContent>
                      </Card>
                  </Link>
                  ))}
              </div>
          </div>
      </div>
      <Link to="/custom-documents" className="absolute bottom-8 right-8" >
        <Button className="flex justify-around items-center mx-2 p-6" >
          <PlusCircleIcon className="w-4 h-4"  />
          <div className="text-lg" >Custom Documents</div>
        </Button>
      </Link>
    </>
  )
}