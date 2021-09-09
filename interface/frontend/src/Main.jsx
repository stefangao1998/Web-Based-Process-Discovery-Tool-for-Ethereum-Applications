import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import {Rnd} from 'react-rnd';
import Slider from '@material-ui/core/Slider';

import DFGSection from './pages/DFGSection';
import NetworkSection from './pages/networkSection'
import BLFSection from './pages/BLFSection'
import {
  SyncOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  BugOutlined,
  EditOutlined,
  FolderOpenOutlined,
  VerticalAlignBottomOutlined
} from '@ant-design/icons';
import defaultFile from './assets/log_pid0_all.xes';

const saveSvgAsPng = require('save-svg-as-png')
const fileDownload = require('js-file-download');
const ratio = 3.5
const imageOptions = {
  scale: 5,
  encoderOptions: 1,
  backgroundColor: 'transparent',
  width: 0
}
const Main = () => {
  const [loading, setLoading] = useState(false)
  const [queryText, setQueryText] = useState('');

  const [uploadFile, setUploadFile] = useState(undefined);
  const [uploadFileName, setUploadFileName] = useState('');
  const [fileText, setFileText] = useState('');
	// Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleQueryChange = event => {
    const fileUploaded = event.target.files[0];
		console.log(fileUploaded)
    fileUploaded&&setUploadFile(fileUploaded);
		fileUploaded&&setUploadFileName(fileUploaded.name)
    fileUploaded&&showFile(event)
  };

  const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      // console.log(text)
      // alert(text)
      setFileText(text)
      setQueryText(text)
    };
    reader.readAsText(e.target.files[0])
  }


	const [apiResponse, setApiResponse] = useState('')

	const [isChecked, setIschecked] = useState(true)

  const testExec = () => {
		setLoading(true)
    const text = queryText.replace(/\n\r?/g, '%0D%0A');
		// fetch(`http://localhost:9000/execBLF/?filename=${uploadFileName}`)
		fetch(`http://localhost:9000/execBLF/?query=${text}`)
      .then(res => res.text())
      .then(res => {
				setApiResponse(res)
				console.log(res)
				setLoading(false)
        setIsAbleToShow(true)
			})
      .catch(err => {
				setLoading(false)
			});
  }

  const validateQuery = () => {
		setLoading(true)
    const text = queryText.replace(/\n\r?/g, '%0D%0A');
		fetch(`http://localhost:9000/validateBLF/?query=${text}`)
      .then(res => res.text())
      .then(res => {
				setApiResponse(res)
				console.log(res)
				setLoading(false)
        setIschecked(false)
			})
      .catch(err => {
				setLoading(false)
			});
  }

  const saveQuery = () => {
		setLoading(true)
    const text = queryText.replace(/\n\r?/g, '%0D%0A');
		fetch(`http://localhost:9000/saveBLF/?query=${text}`)
      .then(res => res.text())
      .then(res => {
				console.log(res)
        fileDownload(queryText, 'testPipelineExample.bcql');
        setApiResponse(res)
				setLoading(false)
			})
      .catch(err => {
				setLoading(false)
			});
  }

  /////////////////////////////////////
  const [uploadFileXES, setUploadFileXES] = useState(undefined);
  const [uploadFileExt, setUploadFileExt] = useState('');
  const [fileTextXES, setFileTextXES] = useState('');
  var node = [];
  var link = [];
  const [graphData, setGraphData] = useState(null)
	const [apiResponseXES, setApiResponseXES] = useState('')
	const [isUseLayout, setIsUseLayout] = useState(false)
  
  const hiddenFileInputXES = React.useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClickXES = event => {
    hiddenFileInputXES.current.click();
  };

  const handleChangeXES = (event) => {
    console.log(defaultFile)
    const file = event.target.files[0]
    file&&setUploadFileXES(file)
    const ext = file&&file.name.split('.').pop();
    console.log(event)

    file&&setUploadFileExt(ext);
    file&&showFileXES(event)
    file&&setLoading(true)
  };

  const showFileXES = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      // alert(text)
      setIsUseLayout(false)
      setFileTextXES(text)
      extractUploadTrace(text)
      setLoading(false)
    };
    reader.readAsText(e.target.files[0])
  }

  const extractUploadTrace = (text) => {
    var traces = text.match(/<trace>([\s\S]*?)<\/trace>/g)
    for (var i=0; i<traces.length; i++) {
      extractEvent(traces[i]);
    }
    // extractEvent(traces[0]);
    console.log(node)
    console.log(link)
  }

  const extractTrace = () => {
    var traces = fileText.match(/<trace>([\s\S]*?)<\/trace>/g)
    for (var i=0; i<traces.length; i++) {
      extractEvent(traces[i]);
    }
    // extractEvent(traces[0]);

  }

  const extractEvent = (trace) => {
    // console.log(trace)
    console.log('extract trace')
    var events = trace.match(/<event>([\s\S]*?)<\/event>/g)
    for (var i=0; i<events.length; i++) {
      const name = extractEventName(events[i])
      if (i===0) {
        createNode('START')
        createLink('START', name)
      }
      if (i===events.length-1){
        createNode('END')
        createLink(name, 'END')
      }
      createNode(name)
      const nextName = extractEventName(events[i+1])
      createLink(name, nextName)
    }
    // createLink(extractEventName(events[0]), extractEventName(events[0]))
    setGraphData({nodes: node, links: link})
  }

  const extractEventName = (event) => {
    if (!event) return 'NOTEXIST'
    // console.log(event)
    var strArr = event.match(/.*concept:name.*\n/g)
    var str = JSON.stringify(strArr)
    // console.log(str)
    var matchStr = str.split('value=')[1]
    var name = matchStr.substring(
      2, 
      matchStr.indexOf('"', 2)-1
    );
    // console.log(name);
    return name
  }

  const createNode = (name) => {
    if (name==='NOTEXIST') return;
    if (checkExistNode(name)) {
      // console.log('exist')
    } else {
      // if (positionConfig[14]) console.log(positionConfig[999])
      if (name==='START') {
        node.push({id: `${name}`, label: `${name}`, x: positionConfig[0].x*ratio, y:positionConfig[0].y*ratio})
      } else if (name==='END') {
        node.push({id: `${name}`, label: `${name}`, x: positionConfig[999].x*ratio, y:positionConfig[999].y*ratio})
      } else {
        if (positionConfig[node.length]) {
          node.push({id: `${name}`, label: `${name}`, x: positionConfig[node.length].x*ratio, y:positionConfig[node.length].y*ratio})
        } else {
          node.push({id: `${name}`, label: `${name}`})
        }
      }
    }
    // console.log(checkExistNode(name))
    // node.push({id: `${name}`})
  }

  const createLink = (s, t) => {
    if (t==='NOTEXIST') return;
    // console.log(s, t)
    const label = checkExistLink(s, t)
    const newLabel = Number(label)+1; 
    if (label) {
      linkLabelPlusOne(s, t)
    } else {
      link.push({ source: `${s}`, target: `${t}`, label: `${newLabel}` })
     
    }
   
  }

  const checkExistNode = (name) => {
    // console.log(node)
    for (var i=0; i<node.length; i++) {
      if (node[i].id===name) return true
    }
    return false
  }

  const checkExistLink = (s, t) => {
    // console.log(link)
    // console.log(s, t)
    for (var i=0; i<link.length; i++) {
      if (link[i].source===s && link[i].target===t) return link[i].label
    }
    return 0
  }

  const linkLabelPlusOne = (s, t) => {
    for (var i=0; i<link.length; i++) {
      if (link[i].source===s && link[i].target===t) link[i].label=Number(link[i].label)+1
    }
  }

  const downloadXES = () => {
    setLoading(true)
		fetch(`http://localhost:9000/downloadLog`)
      .then(res => res.text())
      .then(res => {
				setApiResponseXES(res)
				console.log(res)
        fileDownload(res, 'logs.xes');
        setLoading(false)
			})
      .catch(err => {
				setLoading(false)
			});
  }

  const savePNG = () => {
    if (isUseLayout) {
      saveSvgAsPng.saveSvgAsPng(document.getElementsByClassName("dagre-d3-react")[0], 'dfg.png', imageOptions);
    } else {
      saveSvgAsPng.saveSvgAsPng(document.getElementsByName("svg-container-graph-id")[0], 'dfg.png', imageOptions);
    }
  };


  /////////////////////////////////////

	const [isAbleToShow, setIsAbleToShow] = useState(false)
  const [fileContent, setFileContent] = useState('');
  const [distance, setDistance] = useState(0.4);

	useEffect(()=>{
		isAbleToShow&&fetch(`http://localhost:9000/autoDFG`)
			.then(res => res.text())
			.then(res => {
				console.log(res)
				setFileContent(res)
			})
			.catch(err => {
			});
	}, [isAbleToShow])

	const handleSliderChange = (event, newValue) => {
    setDistance(newValue);
  };

  return (
    <main style={{height: '100%'}}>
      <h1 className="header">Blockchain Logging Framework Pipeline</h1>
      <div style={{display: 'flex', height: '90%'}}>
        <div style={{display: 'flex', flexDirection: 'column', width: '1%'}}>
			    <Slider value={distance} onChange={handleSliderChange} orientation="vertical" aria-labelledby="vertical-slider" min={0.1} step={0.01} max={0.7}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '99%'}}>
          <DFGSection 
            className={'DFGSection'} 
            isAbleToShow={isAbleToShow} 
            fileContent={fileContent} 
            distance={distance} 
            setDistance={setDistance}
            graphData={graphData}
            isUseLayout={isUseLayout}
            setIsUseLayout={setIsUseLayout}
            extractEvent={extractEvent}
          />
          <BLFSection 
            setIsAbleToShow={setIsAbleToShow} 
            distance={distance} 
            queryText={queryText}
            setQueryText={setQueryText}
            apiResponse={apiResponse}
            loading={loading}
            isChecked={isChecked}
            setIschecked={setIschecked}
          />
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', backgroundColor: 'transparent', marginLeft: '5%', marginRight: '5%', marginTop: '10px', justifyContent: 'space-around', height: window.innerHeight*0.1}}>
        <div style={{display: 'flex'}}>
          <button 
            className={loading ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading}
            onClick={handleClick}
          >
            <FolderOpenOutlined />
            Import BLF Query
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleQueryChange}
            style={{display: 'none'}}
          />
          <button
            // style={{height: 60}}
            className={loading ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading}
            onClick={handleClickXES}
          >
            <FolderOpenOutlined />
            Import XES Log
          </button>
          <input
            type="file"
            ref={hiddenFileInputXES}
            onChange={handleChangeXES}
            style={{display: 'none'}}
          />
        </div>
        <div style={{display: 'flex'}}>
          <button 
            className={loading ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading}
            onClick={saveQuery}
          >
            <VerticalAlignBottomOutlined />
            Save BLF Query
          </button>
          <button
            className={loading||!graphData ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading||!graphData}
            onClick={savePNG}
          >
            <VerticalAlignBottomOutlined />
            Save Graph PNG
          </button>
          <button
            className={loading||!graphData ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading||!graphData}
            onClick={downloadXES}
          >
            <VerticalAlignBottomOutlined />
            Save XES Log
          </button>
        </div>
        <div style={{display: 'flex'}}>
          <button 
            className={loading ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading}
            onClick={validateQuery}
          >
            <CheckCircleOutlined />
            Validate BLF Query
          </button>
          <button 
            className={loading ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading}
            onClick={testExec}
          >
            <BugOutlined />
            Execute BLF Query
          </button>
          <button
            className={loading||!graphData ? 'btn-remix-disabled' : 'btn-remix'}
            disabled={loading||!graphData}
            onClick={()=>setIsUseLayout(!isUseLayout)}
          >
            <SyncOutlined />
            Use Layout
          </button>
        </div>
      </div>
		</main>
  )
}

const positionConfig = {
  0: {
    x: 80,
    y: 80,
  },
  1: {
    x: 100,
    y: 80,
  },
  2: {
    x: 120,
    y: 55,
  },
  3: {
    x: 120,
    y: 105,
  },
  4: {
    x: 130,
    y: 86,
  },
  5: {
    x: 140,
    y: 113,
  },
  6: {
    x: 140,
    y: 47,
  },
  7: {
    x: 160,
    y: 90,
  },
  8: {
    x: 160,
    y: 61,
  },
  9: {
    x: 180,
    y: 77,
  },
  10: {
    x: 180,
    y: 43,
  },
  11: {
    x: 180,
    y: 119,
  },
  12: {
    x: 200,
    y: 70,
  },
  13: {
    x: 200,
    y: 50,
  },
  14: {
    x: 220,
    y: 70,
  },
  15: {
    x: 220,
    y: 90,
  },
  16: {
    x: 220,
    y: 40,
  },
  17: {
    x: 220,
    y: 110,
  },
  18: {
    x: 240,
    y: 60,
  },
  19: {
    x: 240,
    y: 40,
  },
  20: {
    x: 240,
    y: 80,
  },
  21: {
    x: 240,
    y: 100,
  },
  999: {
    x: 250,
    y: 80,
  }
}
export default Main
