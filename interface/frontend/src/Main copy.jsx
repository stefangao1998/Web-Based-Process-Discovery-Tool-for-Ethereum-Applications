import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import {Rnd} from 'react-rnd';
import Slider from '@material-ui/core/Slider';

import DFGSection from './pages/DFGSection';
import NetworkSection from './pages/networkSection'
import BLFSection from './pages/BLFSection'
import {
  VerticalAlignMiddleOutlined
} from '@ant-design/icons';
const Main = () => {
  const [showEvent, setShowEvent] = useState(false)
  const [pastLogs, setPastLogs] = useState(null)

  // useEffect(async () => {
  //   const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545/");
  //   // web3.eth.getAccounts().then(console.log); // get accounts
  //   web3.eth.getPastLogs({
  //     address: "0x1F6eABA4E030BeDD707A1E375BFa3274f89B3888", 
  //     fromBlock: 1, 
  //     toBlock: "latest"
  //   }).then(
  //     // console.log // get past logs
  //   ); 
  //   // const blockNumber = await web3.eth.getBlockNumber()
  //   // for (var i=1; i<=blockNumber; i++) {
  //   //   web3.eth.getTransactionFromBlock(i, 0).then((transaction)=>{
  //   //     // console.log(transaction) // get transaction
  //   //   }) 
  //   // }
  //   var metaCoinContract = new web3.eth.Contract(abi, '0x1F6eABA4E030BeDD707A1E375BFa3274f89B3888');
  //   metaCoinContract.getPastEvents("allEvents", {
  //     fromBlock: 1,
  //     toBlock: 'latest'
  //   }).then((res)=>{
  //     console.log(res)  // get past logs
  //     setPastLogs(res)
  //   })
  // }, []);
	const [isAbleToShow, setIsAbleToShow] = useState(false)
  const [fileContent, setFileContent] = useState('');
  const [distance, setDistance] = useState(25);

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

	const handleChange = (event, newValue) => {
    setDistance(newValue);
  };

  return (
    <main style={{height: '100%'}}>
      <h1 className="header">Blockchain Logging Framework Pipeline</h1>
			{/* <NetworkSection /> */}
			<Slider value={distance} onChange={handleChange} aria-labelledby="continuous-slider" min={1} step={1} max={30}/>
			<DFGSection className={'DFGSection'} isAbleToShow={isAbleToShow} fileContent={fileContent} distance={distance} setDistance={setDistance}/>
			<BLFSection setIsAbleToShow={setIsAbleToShow} distance={distance}/>
		</main>
  )
}


export default Main
