import React, { useEffect, useState, useRef } from "react";
import "./style.css";

const Tab = ({ children }) => {
  const [activeTabSubTab, setActiveSubTab] = useState(0);
  const [tabsData, setTabsData] = useState([]);
  const [dataAvailalbe, SetdataAvailalbe] = useState(false);

  useEffect(() => {
    let data = [];
    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;
      const { props: { tab,isMain,children }} = element;
      data.push({ tab,isMain,children });
    });

    //console.log("data", data);
    setTabsData(data);

  }, [children]);


  useEffect(() => {
        //console.log("active change");
    if(tabsData[activeTabSubTab] !== undefined){
            // console.log("children",tabsData);
            // console.log("children LENGTH",tabsData[activeTabSubTab].children[1].props.data.length);

      if(tabsData[activeTabSubTab].children[1].props.data.length > 0){
         SetdataAvailalbe(true)
      }else{ SetdataAvailalbe(false)}
    }

      setActiveSubTab(0)
   
  },[tabsData]);


  const container_refZ = useRef(null);
      useEffect(() => {
           //console.log("-",container_refZ.current.closest('#root').clientHeight);
       if(tabsData.length !=0  )    
       {
          // console.log("active tab",activeTabSubTab)
          // console.log("tab data",tabsData)
            if(container_refZ.current && tabsData[activeTabSubTab]){

              let message = { 
                    height:container_refZ.current.closest('#root').clientHeight,
                    rows:container_refZ.current.children.length,
                    tabName:tabsData[activeTabSubTab].tab
                  }
                  if(message.height!=="undefined" ){
                //   console.log("*Height info from Dahboard:",message);
                    window.parent.postMessage(message,"*");
                  }
            }
        }
      });

      function handleSubTabClick(idx) {
        idx==tabsData.length ?   setActiveSubTab(0) :  setActiveSubTab(idx);
      }

  return (
    <div className={dataAvailalbe?"":"noAccessBg"}>
      <ul className="nav nav-tabs nav-justified" >
        {tabsData.map(({tab}, idx) => {
            return (
                  <li  key={idx}  style={ tab =="-"? { display:"none"} : { display:"block"}} className={`nav-item ${idx === activeTabSubTab ? "active" : ""}`}>
                    <a
                      className={`nav-link ${idx === activeTabSubTab ? "active" : ""}`}
                      href="#"
                      onClick={() => handleSubTabClick(idx)}>
                      {tab}
                    </a>
                  </li>
            )
        })}
      </ul>

      <div ref={container_refZ} className={"tab-content p-3"}>
            {tabsData[activeTabSubTab] && tabsData[activeTabSubTab].children}
      </div>
    </div>
  );
};


const TabPane = ({ children }) => {
  return ( children );
};

Tab.TabPane = TabPane;


export default Tab;
//className="w-100 custom-tab"
//className="tab-content p-3 noAccessBg"
//className={dataAvailalbe?"w-100 custom-tab":" w-100 custom-tab noAccessBg"}
 // className = this.state.clicked ? 'click-state' : 'base-state';
 // className={dataAvailalbe?"tab-content p-3 ":" w-100 custom-tab noAccessBg"}