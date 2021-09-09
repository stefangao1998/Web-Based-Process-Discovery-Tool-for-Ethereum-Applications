import React, {useState, useEffect} from 'react';

import Papa from 'papaparse';
import { useTable } from 'react-table';
import Web3 from 'web3';
import GraphSection from '../GraphSection';
import CustomInputArea from '../../components/CustomInputArea'

import Spin from 'antd/es/spin';
import 'antd/es/spin/style/css';
import 'antd/es/switch/style/css';
import { Input, Button, Switch } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  BugOutlined,
  EditOutlined,
  FolderOpenOutlined,
  VerticalAlignBottomOutlined
} from '@ant-design/icons';

const fileDownload = require('js-file-download');

const { TextArea } = Input;
const SingleTile = (props) => {
	const {
		onPress,
		buttonText,
		requiredText,
	} = props;
	return (
		<div className='row'>
			<div className='column'>
				<button
					className={'touchableOpacity'}
					onClick={onPress}
				>
					{buttonText}
				</button>
			</div>
			<div className='column'>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginLeft: '20px'}}>required: <p style={{color: '#673ab7'}}>{requiredText}</p></div>
			</div>
		</div>
	)
}

const BLFSection = (props) => {
  const {setIsAbleToShow, distance} = props
  const [link, setLink] = useState("wss://mainnet.infura.io/ws/v3/c6c538122fa045f0b35aee6c8ce7efda") //ws://localhost:7545/
  const [address, setAddress] = useState("0x06012c8cf97BEaD5deAe237070F9587f8E7A266d") 
	// truffle metaCoin 0x1F6eABA4E030BeDD707A1E375BFa3274f89B3888
	// truffle wrestling 0x5179334d5e758f86002B8Ac8e44f712cA4455ad3
	// infura metacoin transfer 0xdAC17F958D2ee523a2206206994597C13D831ec7
	// infura cryptoKitties transfer 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
	// infura cryptoKitties Birth 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d
	// infura cryptoKitties AuctionCreated 0xb1690c08e213a35ed9bab7b318de14420fb57d8c

	const [fromBlock, setFromBlock] = useState(10000000)
  const [toBlock, setToBlock] = useState(10001775) //"latest"
	const [signature, setSignature] = useState("") //"latest"
	const [isBLFShowing, setIsBLFShowing] = useState(false)

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
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
		console.log(fileUploaded)
    fileUploaded&&setUploadFile(fileUploaded);
		fileUploaded&&setUploadFileName(fileUploaded.name)
    showFile(event)
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

  return (
    <div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
      height: window.innerHeight*(0.9-distance),
      backgroundColor: 'green'
			// marginTop: '20px'
		}}>
      {/* <div style={{display: 'flex', alignItems: 'center', width: '90%', marginTop: '0px', justifyContent:'flex-start', color: '#fff'}}>
        <h2 style={{color: '#fff'}}>{isChecked ? 'BLF Query' : 'Output'}</h2>
        <Switch checkedChildren="Query" unCheckedChildren="Output" defaultChecked 
          onChange={(checked)=>setIschecked(checked)}
          checked={isChecked}
          style={{alignSelf: 'center', marginLeft: 10}}
        />
      </div> */}

      <TextArea 
        placeholder="Compose your query" 
        value={queryText}
        onChange={(e)=>{
          setQueryText(e.target.value)
        }}
        rows={distance}
        // autoSize={{ minRows: 25, maxRows: 25 }} 
        // autoSize={{ minRows: 25 }} 
        style={{
          display: isChecked ? 'flex' : 'none',
          width: '90%',
          marginBottom: '20px',
          backgroundColor: '#2A2C40',
          color: '#BABBCC',
        }}
      />
			{/* {apiResponse && */}
      <div style={{width: '90%'}}>
      {/* <div style={{display: 'flex', alignItems: 'flex-start', marginTop: '20px'}}>
        <h2 style={{color: '#fff'}}>Output</h2>
      </div> */}
      <TextArea 
        rows={distance}
        // autoSize={{ minRows: 2, maxRows: 10 }} 
        value={apiResponse}
        style={{
          display: !isChecked ? 'flex' : 'none',
          width: '100%',
          marginBottom: '20px',
          color: '#BABBCC',
          backgroundColor: '#2A2C40',
          alignSelf: 'center',
          borderColor: '#222236'//2A2C40
        }} />
        </div>
        {/* } */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        justifyContent: 'space-between'
      }}>
        <button 
          className={'btn-remix'}
          disabled={loading}
          onClick={handleClick}

        >
          <FolderOpenOutlined />
          Import
        </button>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{display: 'none'}}
        />
        <div style={{display: 'flex'}}>
          <button 
            className={'btn-remix'}
            disabled={loading}
            onClick={validateQuery}
          >
            <CheckCircleOutlined />
            Validate
          </button>
          <button 
            className={'btn-remix'}
            disabled={loading}
            onClick={saveQuery}
          >
            <VerticalAlignBottomOutlined />
            Save
          </button>
        </div>
        <button 
          className={'btn-remix'}
          disabled={loading}
          onClick={testExec}
        >
          <BugOutlined />
          EXECUTE
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        justifyContent: 'space-between',
        marginBottom: '100px'
      }}>
        {uploadFile && <div className='column'>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '10px', color: '#fff'}}><p style={{color: '#02AAB0'}}>{uploadFileName}</p></div> 
        </div>}

      </div>
			{/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        <button 
          className={'btn-remix'}
          onClick={testExec}
        >
          EXECUTE
        </button>
			</div> */}
			{loading && 
      <Spin 
        className="ant-spin-text" 
        tip="Loading..." 
        style={{
          position: 'fixed', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />}
    </div>
  )
}


export default BLFSection
