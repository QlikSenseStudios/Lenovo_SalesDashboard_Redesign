import React, { useState }  from "react";
import { FiExternalLink, FiLink } from 'react-icons/fi';


function changeBackground(e) {
 // e.target.style.background = 'red';
  console.log(e.target);
  //"kpi-value display"
 
}
function leaveBackground(e) {
  e.target.style.background = 'lightGrey';
  console.log(e.target)
}

// const [state, setstate] = useState({data:""})
  
// const changeState = () => {  
//     setstate({data:`hover`}); 
//    }; 



const ViewMore = ({ drillDownUrl }) => {
   const [iconColor, setIconColor] = React.useState({data:{bg:"#F3F4F4 ",color:"#3E8DDD"}});




  return (
    <a {...drillDownUrl}  style={{ textDecoration: "none" }}
    // onMouseEnter={()=>changeState("#3E8DDD")}
    target="_blank">
      
   <div className="viewMore"  style={{background:iconColor.data.bg, color:iconColor.data.color}}
   onMouseEnter={()=>setIconColor( drillDownUrl.href? {data:{bg:"#3E8DDD",color:"white"}}: {data:{bg:"#F3F4F4 ",color:"#3E8DDD"}} )}
  //onMouseEnter={()=>changeState("#3E8DDD")}
   onMouseLeave={()=>setIconColor({data:{bg:"#F3F4F4 ",color:"#3E8DDD"}})}
   //onMouseOver={changeBackground}
  // onMouseLeave={leaveBackground}
   >
    {drillDownUrl.href? "View more":""} 
    {drillDownUrl.href? <FiExternalLink style={{ float:"right",position:"relative", top:"5px", left:"-5px",color:iconColor.data.color}} />:""} 
   </div>
  </a>
  );
};
export default ViewMore;
