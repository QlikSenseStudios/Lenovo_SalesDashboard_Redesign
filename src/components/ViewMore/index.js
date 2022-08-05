import React, { useState }  from "react";
import { FiExternalLink } from 'react-icons/fi';


const ViewMore = ({ drillDownUrl }) => {
   const [iconColor, setIconColor] = useState({data:{bg:"#F3F4F4",color:"#3E8DDD"}});

  return (
    <a {...drillDownUrl}  style={{ textDecoration: "none" }}
    // onMouseEnter={()=>changeState("#3E8DDD")}
    target="_blank">
      
   <div className="viewMore"  style={{background:iconColor.data.bg, color:iconColor.data.color}}
   onMouseEnter={()=>setIconColor( drillDownUrl.href? {data:{bg:"#3E8DDD",color:"white"}}: {data:{bg:"#F3F4F4",color:"#3E8DDD"}} )}
   onMouseLeave={()=>setIconColor({data:{bg:"#F3F4F4 ",color:"#3E8DDD"}})}
   >
    {drillDownUrl.href? "View more":""} 
    {drillDownUrl.href? <FiExternalLink style={{ float:"right",position:"relative", top:"5px", left:"-5px",color:iconColor.data.color}} />:""} 
   </div>
  </a>
  );
};
export default ViewMore;
