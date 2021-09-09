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
  const {
    distance, 
    setIsAbleToShow, 
    queryText,
    setQueryText,
    apiResponse,
    loading,
    isChecked,
    setIschecked
  } = props


  return (
    <div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'flex-start',
      height: window.innerHeight*distance,
      backgroundColor: 'transparent'
		}}>
      <div 
        style={{
          display: 'flex', 
          alignItems: 'center', 
          width: '95%', 
          marginTop: '0px', 
          justifyContent:'flex-start', 
          color: '#fff', 
          backgroundColor: '#2A2C40',
          border: '1px solid #767676',
          borderBottomColor:  '#2A2C40'
        }}
      >
        <div style={{marginLeft: 10, color: isChecked ? '#BABBCC' : '#767676', cursor: 'pointer'}} onClick={()=>setIschecked(true)}>Query</div>
        <div style={{marginLeft: 15, color: !isChecked ? '#BABBCC' : '#767676', cursor: 'pointer'}} onClick={()=>setIschecked(false)}>Output</div>
      </div>
      <TextArea 
        placeholder="Compose your query" 
        value={queryText}
        onChange={(e)=>{
          setQueryText(e.target.value)
        }}
        // rows={distance}
        // autoSize={{ minRows: 25, maxRows: 25 }} 
        // autoSize={{ minRows: 25 }} 
        style={{
          display: isChecked ? 'flex' : 'none',
          width: '95%',
          height: window.innerHeight*distance,
          backgroundColor: '#2A2C40',
          color: '#BABBCC',
          borderTopColor: '#2A2C40'
        }}
      />
      <TextArea 
        value={apiResponse}
        style={{
          display: !isChecked ? 'flex' : 'none',
          width: '95%',
          height: window.innerHeight*distance,
          color: '#BABBCC',
          backgroundColor: '#2A2C40',
          alignSelf: 'center',
          borderTopColor: '#2A2C40'
        }} />
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
