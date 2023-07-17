import {Formik, Form, Field} from "formik"
import { useContext } from "react"
import { DistanceContext } from "../App"

export default function Distance(props){

    

    return (
        <div className="dropdown">
              <Formik
                    enableReinitialize= {true}
                    initialValues={{distance:props.distance}}
                    onSubmit={(values)=>{
                        props.changeDistance(values.distance);
                    }}
              >
        {
            (formik)=>(
                <Form>
                <button className="btn border-0 text-white dropdown-toggle" type="button" id="dropdownMenuButtondistance" data-bs-toggle="dropdown" aria-expanded="false">
                   Distance
                 </button>
                 <ul className="dropdown-menu px-3 py-2" aria-labelledby="dropdownMenuButtondistance">
                   <li><Field name="distance" type="range" className="form-range fs-6 px-1 " min="5" max="50" /> </li>
                   <li className="d-flex justify-content-between px-1"><span className="py-2 fw-bolder">{formik.values.distance+" KM"}</span><button type="submit" className="btn btn-primary fs-6 p-0 px-3">OK</button></li>
           
                 </ul>
             </Form>

            )
        }
      
                      </Formik>            
            </div>
    )
}