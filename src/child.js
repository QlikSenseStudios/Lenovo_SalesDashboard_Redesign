

{/* parent-   I am a {a}
                 <Child x={a} setX={setA}></Child>
      */}

    const Child = ({x,setX}) => {
          return(<div> 
            <p>child- I am a child</p>
            <button onClick={()=>setX(["C","D"])}> click</button>
            <button onClick={()=>setX(["E","F"])}> click</button>
          </div>)
    const subtabs = ["A","B", "C"];

    function test(){
    setX(subtabs);
    }

          return(
            <ul className="nav nav-tabs nav-justified">
              {x.map(( val, idx) => {
                return(
                      <li key={idx}  className={`nav-item`}>
                          <a className={`nav-link`}  href="#"
                          onClick={()=>test(subtabs)}
                          >{val}</a>
                      </li>
                )

              })

              }
            </ul>
          )

    }


