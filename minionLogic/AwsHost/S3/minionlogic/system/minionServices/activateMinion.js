////////////////////////////////////////////
//          activateMinion
////////////////////////////////////////////
console.log(`***Load activateMinion...`);

///////////////////////////////////////////////////////////////////
activateLocalMinion = async function(receivedOrder) {
console.log(`activateLocalMinion: ${receivedOrder.ORDER.minionName}`);

//create transferredOrder
	var transferredOrder = {
		SUBJECT: 'ORDERUPDATE',
		
		TICKET  : receivedOrder.TICKET,
		
		UPDATE : {
			timestamp: `${Date.now()}`,
			progress : 'TRANSFERRED',
			note     : 'order was transferred to provider for processing',
		},	
	};

	console.log(`***Send orderTransferred update`);	
	await global.updateContract(transferredOrder);
	
//Load minion
	var minion = await global.loadModule(`minions/${receivedOrder.ORDER.minionName}/`, `minion.js`);
	console.log(`minion: `, minion);

//invokeMinion
	var orderResult = await minion(receivedOrder);
	
	orderResult.SUBJECT = 'COMPLETED',
	orderResult.TICKET  = receivedOrder.TICKET,
	orderResult.UPDATE  = {
		timestamp: `${Date.now()}`,
		progress : 'CLOSED',
		note     : 'Order was filled and transferred to client.',
	},	
	
	console.log(`orderResult: `, orderResult);
	await global.updateContract(orderResult);

};

///////////////////////////////////////////////////////////////////
/////////////////////// MAIN //////////////////////////////////////
///////////////////////////////////////////////////////////////////
module.exports = async function(connection, receivedOrder) {

try {
console.log(`***Start activateMinion, receivedOrder: `, receivedOrder);

	var contract = await global.createContract(receivedOrder);

	
//call activateMinion method
	console.log(`activate method: `, contract.PROVIDER.activateWith, contract);
	receivedOrder.TICKET = contract.TICKET 
	await eval(contract.PROVIDER.activateWith + '(receivedOrder)');
	//await activateLocalMinion(receivedOrder);
	
} catch(err) {
	console.log(`***ABORT: `, err);

//create orderFailed
	
	var orderFailed = {
		TICKET: {
			client     : 'client',
			provider   : 'provider',
			clientRef  : 'job210.step27',
			contractRef: '12345678',
			createdOn  : '1243657790',
		},
		
		UPDATE: {
			timestamp: '1234566790',
			progress : 'FAILED',
			note     : 'Unknown problem causing Order to Fail with message:\nerrMsg: ' + err.stack,
		},	
	};

	console.log(`***Send orderFailed`);	
	await global.sendMemo('client', orderFailed);
	
}};