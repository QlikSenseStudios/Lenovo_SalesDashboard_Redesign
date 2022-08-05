import React, { useEffect, useState } from "react";
import "./style.css";

const Tab = ({ children, active = 0 }) => {
  const [activeTab, setActiveTab] = useState(active);
  const [tabsData, setTabsData] = useState([]);
  const [dataAvailalbe, SetdataAvailalbe] = useState([]);


// if(tabsData[activeTab] !=undefined);
// console.log("tbd",(tabsData[activeTab])?children:"")

  useEffect(() => {
    let data = [];
   // let c= [];
    React.Children.forEach(children, (element) => {
      if (!React.isValidElement(element)) return;

      const {
        props: { tab, children },
      } = element;

      data.push({ tab, children });
   // c.push({children })
    });

   
    setTabsData(data);
  }, [children]);

  useEffect(() => {
//     console.log("active change");
//     console.log("tabsData",tabsData);
// console.log("activeTab",activeTab);


    if(tabsData[activeTab] !== undefined){
    //  console.log("children",tabsData[activeTab].children[1].props.data.length);
      if(tabsData[activeTab].children[1].props.data.length === 0){
      SetdataAvailalbe(false)
      }else{ SetdataAvailalbe(true)}
    }
  },[activeTab,children,tabsData]);

  return (
    
    <div className={dataAvailalbe?"":"noAccessBg"}>
      <ul className="nav nav-tabs nav-justified">
        {tabsData.map(({ tab }, idx) => {
         // console.log("tab",children[idx]);
         return (
          <li  key={idx}  className={`nav-item ${idx === activeTab ? "active" : ""}`}>
            <a
              className={`nav-link ${idx === activeTab ? "active" : ""}`}
              href="#"
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </a>
          </li>
        )
        })}
      </ul>
    
      <div className={"tab-content p-3"}>
        {tabsData[activeTab] && tabsData[activeTab].children}
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