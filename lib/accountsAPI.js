/**
 * This library class provides methods for get, post, post and delete in the services
 * for accounts 
 * @Author: Jorge Avila Baldiviezo
 */
var request = require('superagent');
require('superagent-proxy')(request);

var proxy = 'http://172.20.240.5:8080';
var accountsEndPoint = 'https://www.pivotaltracker.com/services/v5/accounts';
var accountsByIdEndPoint = 'https://www.pivotaltracker.com/services/v5/accounts/{account_id}';
var accountSummariesEndPoint = 'https://www.pivotaltracker.com/services/v5/account_summaries'
var accountMembershipsEndPoint = 'https://www.pivotaltracker.com/services/v5/accounts/{account_id}/memberships';
var accountMembershipEndPoint = 'https://www.pivotaltracker.com/services/v5/accounts/{account_id}/memberships/{person_id}';
var tokenHeader = 'token';

var getAccounts = function(token, callback){
	console.log('Getting all accounts...');
	console.log('GET ' + accountsEndPoint);
	request
		.get(accountsEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
	.end(function(err, res){
		if(err){
			console.log('Error when getting the accounts...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('accounts has been got,. response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.getAccounts = getAccounts;

var getAccountById = function(accountId, token, callback){
	console.log('Getting the account...' + accountId);
	var accByIdEndPoint = accountsByIdEndPoint.replace('{account_id}', accountId);
	console.log('GET ' + accByIdEndPoint);

	request
		.get(accByIdEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
	.end(function(err, res){
		if(err){
			console.log('Error when getting the accounts...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The account has been got: response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.getAccountById = getAccountById;

var getAccountSummaries = function(token, callback){
	console.log('Getting the account summaries...');
	console.log('GET ' + accountSummariesEndPoint);

	request
		.get(accountSummariesEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
	.end(function(err, res){
		if(err){
			console.log('Error when getting the accounts...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The account has been got: response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.getAccountSummaries = getAccountSummaries;

var getAccountMemberships = function(accountId, token, callback){
	console.log('Getting the account memberships...');
	var accMembershipsEndPoint = accountMembershipsEndPoint.replace('{account_id}', accountId);
	console.log('GET ' + accMembershipsEndPoint);
	


	request
		.get(accMembershipsEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
	.end(function(err, res){
		if(err){
			console.log('Error when getting the account memberships...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The memberships has been got: response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.getAccountMemberships = getAccountMemberships;

var getAccountMembership = function(ids, token, callback){
	console.log('Getting the membership...');
	var accMembershipEndPoint = accountMembershipEndPoint
									.replace('{account_id}', ids.accountId)
									.replace('{person_id}', ids.personId);
	console.log('GET ' + accMembershipEndPoint);
	
	request
		.get(accMembershipEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
	.end(function(err, res){
		if(err){
			console.log('Error when getting the account membership...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The membership has been got: response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.getAccountMembership = getAccountMembership;

var createMemberInAccount = function(ids, token, callback){
	console.log('Creating the membership...');
	var accMembershipEndPoint = accountMembershipsEndPoint
									.replace('{account_id}', ids.accountId);
	console.log('POST ' + accMembershipEndPoint);
	
	var content = {
		person_id: ids.personId
	};

	request
		.post(accMembershipEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
		.set('Content-Type', 'application/json')
		.send(content)
	.end(function(err, res){
		if(err){
			console.log('Error when creating the new account membership...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The membership has been created in the account: ' + ids.accountId + ' response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.createMemberInAccount = createMemberInAccount;

var updateAccountMember = function(values, token, callback){
	console.log('Updating the membership...');
	var accMembershipEndPoint = accountMembershipEndPoint
									.replace('{account_id}', values.accountId)
									.replace('{person_id}', values.personId);
	console.log('PUT ' + accMembershipEndPoint);
	
	var content = {
		project_creator: values.project_creator
	};

	request
		.put(accMembershipEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
		.set('Content-Type', 'application/json')
		.send(content)
	.end(function(err, res){
		if(err){
			console.log('Error when updating the account membership...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The membership has been updated in the account: ' + values.accountId + ' response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.updateAccountMember = updateAccountMember;

var deleteAccountMember = function(values, token, callback){
	console.log('Deleting the membership...');
	var accMembershipEndPoint = accountMembershipEndPoint
									.replace('{account_id}', values.accountId)
									.replace('{person_id}', values.personId);
	console.log('DELETE ' + accMembershipEndPoint);

	request
		.del(accMembershipEndPoint)
		.proxy(proxy)
		.set(token.tokenName, token.tokenString)
		.set('Content-Type', 'application/json')
	.end(function(err, res){
		if(err){
			console.log('Error when deleting the account membership...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The membership has been deleted in the account: ' + values.accountId + ' response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.deleteAccountMember = deleteAccountMember;
