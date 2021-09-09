import React, {useState, useEffect} from 'react';

import Papa from 'papaparse';
import { useTable } from 'react-table';
import Web3 from 'web3';
import GraphSection from '../GraphSection';
import CustomInput from '../../components/CustomInput'

import Spin from 'antd/es/spin';
import 'antd/es/spin/style/css';

const SingleTile = (props) => {
	const {
		onPress,
		buttonText,
		requiredText
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

const NetworkSection = () => {
  const [link, setLink] = useState("wss://mainnet.infura.io/ws/v3/c6c538122fa045f0b35aee6c8ce7efda") //ws://localhost:7545/
  const [address, setAddress] = useState("0x06012c8cf97BEaD5deAe237070F9587f8E7A266d") 
	// truffle metaCoin 0x1F6eABA4E030BeDD707A1E375BFa3274f89B3888
	// truffle wrestling 0x5179334d5e758f86002B8Ac8e44f712cA4455ad3
	// infura metacoin transfer 0xdAC17F958D2ee523a2206206994597C13D831ec7
	// infura cryptoKitties transfer 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
	// infura cryptoKitties Birth 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d
	// infura cryptoKitties AuctionCreated 0xb1690c08e213a35ed9bab7b318de14420fb57d8c

	const [abi, setAbi] = useState(JSON.stringify(metaCoinAbi))

	const [fromBlock, setFromBlock] = useState(10000000)
  const [toBlock, setToBlock] = useState(10001775) //"latest"
	const [signature, setSignature] = useState("") //"latest"

  const [showEvent, setShowEvent] = useState(false)
  const [pastLogs, setPastLogs] = useState(null)

	const [isShowingOption, setIsShowingOption] = useState(false)
	const [isDebug, setIsDebug] = useState(false)
	const [isQuick, setIsQuick] = useState(false)
	const [isBLFShowing, setIsBLFShowing] = useState(false)

	const [loading, setLoading] = useState(false)

	const web3 = new Web3(Web3.givenProvider || link);




  const [uploadFile, setUploadFile] = useState(undefined);
  const [uploadFileName, setUploadFileName] = useState('');
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
    setUploadFile(fileUploaded);
		setUploadFileName(fileUploaded.name)
  };




	const [apiResponse, setApiResponse] = useState('')

  const testExec = () => {
		setLoading(true)
    // fetch("http://localhost:9000/execGeth")
		// `http://buildingsAPI:111/api/buildings/?myparam1=${abc_energyprogramid}`
		fetch(`http://localhost:9000/execBLF/?filename=${uploadFileName}`)
      .then(res => res.text())
      .then(res => {
				setApiResponse(res)
				console.log(res)
				setLoading(false)
			})
      .catch(err => {
				setLoading(false)
			});
  }

	// const nodeUploadFile = () => {

  // }

  const getRes = () => {
    // web3.eth.getAccounts().then(console.log); // get accounts
    web3.eth.getPastLogs({
      address: address, 
      fromBlock: fromBlock, 
      toBlock: toBlock
    }).then((data)=>{
      console.log('data', data) // get past logs
    }); 
    // const blockNumber = await web3.eth.getBlockNumber()
    // for (var i=1; i<=blockNumber; i++) {
    //   web3.eth.getTransactionFromBlock(i, 0).then((transaction)=>{
    //     // console.log(transaction) // get transaction
    //   }) 
    // }
    var contractInstance = new web3.eth.Contract(JSON.parse(abi), address);
    contractInstance.getPastEvents("allEvents", {
      fromBlock: fromBlock,
      toBlock: toBlock,
      // topics: ['Transfer(address, address, uint256)']
    }).then((res)=>{
      console.log(res)  // get past logs
      setPastLogs(res)
    })
  }

	const showLogEvents = () => {
		setLoading(true)
    var contractInstance = new web3.eth.Contract(JSON.parse(abi), address);
    contractInstance.getPastEvents("allEvents", {
      fromBlock: fromBlock,
      toBlock: toBlock,
      // topics: ['Transfer(address, address, uint256)']
    }).then((res)=>{
      console.log(res)  // get past logs
      setPastLogs(res)
			setLoading(false)
    })
  }

	const showTransaction = () => {
		web3.eth.getTransactionFromBlock(toBlock, 0) // infura 12646761, 12646769, truffle 54
			.then((res)=>{
				console.log(res)
				web3.eth.getTransactionReceipt(res.hash)
					.then(console.log);
			});
	}

	const getBlock = () => {
		web3.eth.getBlock(toBlock)
			.then(console.log);	
	}

	const showPastLogsBySig = () => {
		web3.eth.getPastLogs({
			fromBlock: fromBlock, // 10000000
      toBlock: toBlock, // 10050000, 10001775
			topics: [web3.utils.sha3(signature)]
		})
		.then((res)=>{
			for (var i=0; i<res.length; i++) {
				// if (res[i].address === "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d") {
					console.log(res[i])
				// }
			}
		});
	}

	const showPastLogsByAddress = () => {
    web3.eth.getPastLogs({
      address: address, 
      fromBlock: fromBlock, 
      toBlock: toBlock
    }).then((data)=>{
      console.log('data', data) // get past logs
    });
	}

	const showSigHash = () => {
		// console.log(web3.utils.sha3("Transfer(address,address,uint256)")); 
		// console.log(web3.utils.sha3("Birth(address,uint256,uint256,uint256,uint256)")); 
		// console.log(web3.utils.sha3("Pregnant(address,uint256,uint256,uint256)"));
		// console.log(web3.utils.sha3("AuctionCreated(uint256,uint256,uint256,uint256)")); 
		console.log(web3.utils.sha3(signature)); 
	}
  
  return (
    <div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: '20px'
		}}>
			<CustomInput
				type={'text'}
				label="Network Link"
				value={link}
				onPress={setLink}
			/>
			<CustomInput
				type={'text'}
				label="Contract Address"
				value={address}
				onPress={setAddress}
			/>
			<CustomInput
				type={'text'}
				label="fromBlock #"
				value={fromBlock}
				onPress={setFromBlock}
			/>
			<CustomInput
				type={'text'}
				label="toBlock #"
				value={toBlock}
				onPress={setToBlock}
			/>
			<CustomInput
				type={'text'}
				label="Signature"
				value={signature}
				onPress={setSignature}
			/>
			<button
				style={{backgroundColor: '#282c34', color: '#673ab7', alignSelf: 'flex-start'}}
				// className={'touchableOpacity'}
				onClick={()=>{setIsShowingOption(!isShowingOption)}}
			>
				options
			</button> 
			{isShowingOption && 
				<CustomInput
					type={'text'}
					label="ABI"
					value={abi}
					onPress={setAbi}
				/>
			}

			<button
				style={{backgroundColor: '#282c34', color: '#673ab7', alignSelf: 'flex-start'}}
				// className={'touchableOpacity'}
				onClick={()=>{setIsDebug(!isDebug)}}
			>
				debug options
			</button> 
			
			{isDebug && <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '70px'}}>
				<SingleTile
					onPress={()=>showSigHash()}
					buttonText={"showHash"}
					requiredText={"signature"}
				/>
				<SingleTile
					onPress={()=>showPastLogsBySig()}
					buttonText={"showPastLogsBySig"}
					requiredText={"fromBlock, toBlock, signature"}
				/>
				<SingleTile
					onPress={()=>showPastLogsByAddress()}
					buttonText={"showPastLogsByAddress"}
					requiredText={"fromBlock, toBlock, Contract Address"}
				/>
				<SingleTile
					onPress={()=>getBlock()}
					buttonText={"getBlock"}
					requiredText={"toBlock"}
				/>
				<SingleTile
					onPress={()=>showTransaction()}
					buttonText={"showTransaction"}
					requiredText={"toBlock"}
				/>
				<SingleTile
					onPress={()=>{
						showLogEvents()
						setShowEvent(true);
					}}
					buttonText={"showLogEvents"}
					requiredText={"fromBlock, toBlock, Contract Address, abi"}
				/>
			</div>}

			<button
				style={{backgroundColor: '#282c34', color: '#673ab7', alignSelf: 'flex-start'}}
				// className={'touchableOpacity'}
				onClick={()=>{setIsQuick(!isQuick)}}
			>
				quick set
			</button> 
			
			{isQuick && <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
				<SingleTile
					onPress={()=>{
						setLink("wss://mainnet.infura.io/ws/v3/c6c538122fa045f0b35aee6c8ce7efda")
						setAddress("0x06012c8cf97BEaD5deAe237070F9587f8E7A266d")
						setFromBlock(6605100)
						setToBlock(6615100)
					}}
					buttonText={"set => cryptoKitties"}
					requiredText={""}
				/>
				<SingleTile
					onPress={()=>{
						setLink("ws://localhost:7545/")
						setAddress("0x1F6eABA4E030BeDD707A1E375BFa3274f89B3888")
						setFromBlock(1)
						setToBlock("latest")
					}}
					buttonText={"set => MetaCoin"}
					requiredText={""}
				/>
				<SingleTile
					onPress={()=>{
						setLink("wss://mainnet.infura.io/ws/v3/c6c538122fa045f0b35aee6c8ce7efda")
						setAddress("0xdAC17F958D2ee523a2206206994597C13D831ec7")
						setFromBlock(10000000)
						setToBlock(10000020)
						setShowEvent(false);
					}}
					buttonText={"CLEAR"}
					requiredText={""}
				/>
			</div>}

			<button
				style={{backgroundColor: '#282c34', color: '#673ab7', alignSelf: 'flex-start'}}
				// className={'touchableOpacity'}
				onClick={()=>{setIsBLFShowing(!isBLFShowing)}}
			>
				BLF Query Select
			</button> 

			{isBLFShowing && <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
				<div className='row'>
					<div className='column'>
						{/* <button
							className={'touchableOpacity'}
						>
							{"Select Query"}
							<input
								className="touchableOpacity"
								type="file"
								name={"file"}
								placeholder={'Select Query"'}
								ref="fileInput"
								onChange={handleChange}
							/>
						</button> */}
						<button 
							className={'touchableOpacity'}
							onClick={handleClick}
						>
							Select a query
						</button>
						<input
							type="file"
							ref={hiddenFileInput}
							onChange={handleChange}
							style={{display: 'none'}}
						/>
					</div>
					{uploadFile && <div className='column'>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginLeft: '20px'}}>Selected: <p style={{color: '#673ab7'}}>{uploadFileName}</p></div>
					</div>}
				</div>
			</div>}

			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '70px'}}>
				<button
					className={'touchableOpacity'}
					onClick={testExec}
				>
					EXECUTE
				</button>
				{/* <button
					className={'touchableOpacity'}
					onClick={nodeUploadFile}
				>
					nodeUploadFile
				</button> */}
			</div>
			{loading && <Spin tip="Loading..." />}
			{apiResponse && <div className='column'>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginLeft: '20px'}}>Result: <p style={{color: '#673ab7'}}>{apiResponse}</p></div>
			</div>}



      
      <br/><br/><br/><br/><br/><br/><br/><br/>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      {showEvent && pastLogs && pastLogs.map((item, index)=>{
        return (
          <div style={{backgroundColor: 'rgb(83,191,236)', borderRadius: 10, width: '60vw', marginBottom: 20}} key={index}>
            <p>event: {item.event}</p>
            <p>blockNumber: {item.blockNumber}</p>
            <p>from: {item.returnValues._from}</p>
            <p>to: {item.returnValues._to}</p>
            <p>value: {item.returnValues._value}</p>
            <br />
          </div>
          )
        })
      }
      </div>
    </div>
  )
}

const metaCoinAbi = [
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "sendCoin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "sufficient",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const wrestlingAbi = [
	{
		"constant": false,
		"inputs": [],
		"name": "wrestle",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "theWinner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler2",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler1Played",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "registerAsAnOpponent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler1",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "gameFinished",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "wrestler2Played",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "wrestler1",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "wrestler2",
				"type": "address"
			}
		],
		"name": "WrestlingStartsEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "wrestler1Deposit",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "wrestler2Deposit",
				"type": "uint256"
			}
		],
		"name": "EndOfRoundEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "gains",
				"type": "uint256"
			}
		],
		"name": "EndOfWrestlingEvent",
		"type": "event"
	}
]

export default NetworkSection
