## Full Report Document
1. [thesisFinalReport.pdf](/thesisFinalReport.pdf)
2. see [seminar_slides.pdf](/seminar_slides.pdf)


## (BLF) Blockchain-Logging-Framework
1. Git clone the code of BLF at https://github.com/TU-ADSP/Blockchain-Logging-Framework
2. follow the steps and run the BLF.
3. there's test query "test.bcql" provide inside the "Blockchain-Logging-Framework" folder.
4. E.g. Running `java -jar target/blf-cmd.jar extract /Users/shenghangao/Documents/UNSW/21T1/COMP4952/Blockchain-Logging-Framework/src/main/resources/test.bcql` 
* Noticed, if using Ganache application, need to combined ganache-cli to provided websocket, E.g. after running Ganache application, running `ganache-cli -p 8545 -f http://localhost:7545`, so that fork the data and then runing demo network while using Truffle.

## (GETH) How to set up private Ethereum Network
Set up local Ethereum Network step by step, see the link provided. In the folder "testGeth", there's 3 accounts and the Ethereum Network has been set up.
1. `cd testGeth`
2. `cd node1` and `sh node1.sh`
3. Open another terminal, `cd node2` and `sh node2.sh`
4. Open another terminal, `cd node3` and `sh node3.sh`. Then the 3 accounts is active.
5. Open another terminal, `geth attach geth.ipc`, now enters the Geth JavaScript console, there's several commands may be helpful inside the help.txt file.
6. Stop the nodes using `ps ax | grep geth`, and `kill <process id>` one by one.
7. Ref: https://www.c-sharpcorner.com/article/setup-your-private-ethereum-network-with-geth2/

## (ganache-cli) How to auto generate private Ethereum Network
The work is similiar to using GETH, but this is faster. There's a folder "smart-contract" has been set up.
1. `cd smart-contract`
2. `npm install -g ganache-cli`
3. `cd contracts`
4. Run `ganache-cli -p 7545`, then there's new empty Ethereum network active.
5. After that, use `truffle` to interact with smart contract.
6. Ref: https://hackernoon.com/ethereum-development-walkthrough-part-2-truffle-ganache-geth-and-mist-8d6320e12269

## Ganache application
The work is similiar to the command line version, but this provides a visual interface. There's link provided to download and get start with Ganache application.
1. Download the app at https://www.trufflesuite.com/ganache
2. Follow the step of set up, the rsult should be same as using the ganache-cli command line.
3. Ref: https://www.trufflesuite.com/docs/ganache/workspaces/creating-workspaces

## (Truffle) How to deploy smart contract on Private Ethereum Network
The tool used to create and interact with local Ethereum network, create smart contarct and deploy them. In the folder "smart-contract", there's a few smart contract has been set up.
1. `npm install -g truffle`
After the ethereum network has been running, changes the port in "truffle-config.js" file, under "module.exports" -> "networks" -> "test"
* Noticed, if using GETH, using the rpc mode.
2. `truffle compile`
3. `truffle migrate --network test`
4. `truffle console --network test` and enters the interactive console.
5. Then you can interact with the smart contract, deploy, sendTransaction, etc. There's several commands may be helpful inside the help.txt file under the "smart-contract" folder.
9. ref: https://hackernoon.com/ethereum-development-walkthrough-part-2-truffle-ganache-geth-and-mist-8d6320e12269


## How to run the Backend/API
1. In your terminal, navigate to the `cd interface` and `cd backend` directory.
2. Run `yarn install` to install all dependencies.
3. Run `yarn start` to start the app.

## How to run the Frontend/Client
1. In another terminal, navigate to the `cd interface` and `cd frontend` directory.
2. Run `yarn install` to install all dependencies.
3. Run `yarn start` to start the app

## Link may be useful
1. https://github.com/TU-ADSP/Blockchain-Logging-Framework/wiki/Manifest  (BLF: extracting logs from Ethereum network, export into XES)
2. http://www.promtools.org/doku.php  (ProM tools: process mining)
3. https://geth.ethereum.org/docs/interface/command-line-options (GETH: Go Ethereum, private ethereum network)
4. https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts (truffle: deploy smart contract on private network)
5. https://danielcaldas.github.io/react-d3-graph/docs/index.html 	(react graph: yarn packages)
6. https://www.sciencedirect.com/science/article/pii/S1877050919322367 (process model: DFS graph detail)
7. https://remix.ethereum.org/ remix editor (solidity => abi json)

## Reference
1. C-sharpcorner.com. 2021. Setup Your Private Ethereum Network With Geth. [online] Available at: <https://www.c-sharpcorner.com/article/setup-your-private-ethereum-network-with-geth2/> [Accessed 29 April 2021].
2. Danielcaldas.github.io. 2021. react-d3-graph 2.6.0 | Documentation. [online] Available at: <https://danielcaldas.github.io/react-d3-graph/docs/index.html> [Accessed 29 April 2021].
3. Geth.ethereum.org. 2021. Command-line Options | Go Ethereum. [online] Available at: <https://geth.ethereum.org/docs/interface/command-line-options> [Accessed 29 April 2021].
4. GitHub. 2021. TU-ADSP/Blockchain-Logging-Framework. [online] Available at: <https://github.com/TU-ADSP/Blockchain-Logging-Framework> [Accessed 29 April 2021].
5. Hackernoon.com. 2021. Ethereum Development Walkthrough (Part 2: Truffle, Ganache, Geth and Mist) | Hacker Noon. [online] Available at: <https://hackernoon.com/ethereum-development-walkthrough-part-2-truffle-ganache-geth-and-mist-8d6320e12269> [Accessed 29 April 2021].
6. Klinkmüller, C., Ponomarev, A., Tran, A., Weber, I. and van der Aalst, W., 2019. Mining Blockchain Processes: Extracting Process Mining Data From Blockchain Applications.
7. Klinkmüller, C., Weber, I., Ponomarev, A., Tran, A. and van der Aalst, W., 2020. Efficient Logging For Blockchain Applications.
8. M.P. van der Aalst, W., 2019. A practitioner’s guide to process mining: Limitations of the directly-follows graph. Fraunhofer Institute for Applied Information Technology, Sankt Augustin, Germany.
9. Promtools.org. 2021. start | ProM Tools. [online] Available at: <http://www.promtools.org/doku.php> [Accessed 29 April 2021].
10. Remix.ethereum.org. 2021. Remix - Ethereum IDE. [online] Available at: <https://remix.ethereum.org/> [Accessed 29 April 2021].
11. Truffle Suite. 2021. Ganache | Creating Workspaces | Documentation | Truffle Suite. [online] Available at: <https://www.trufflesuite.com/docs/ganache/workspaces/creating-workspaces> [Accessed 29 April 2021].
12. Truffle Suite. 2021. Truffle | Interacting with Your Contracts | Documentation | Truffle Suite. [online] Available at: <https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts> [Accessed 29 April 2021].
