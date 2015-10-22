/**
 * This library class provides methods for get, post, post and delete in the services
 * for accounts 
 * @Author: Jorge Avila Baldiviezo
 */
var request = require('superagent');
require('superagent-proxy')(request);

var proxy = 'http://172.20.240.5:8080';
var endPoints = require('..\\endPoints.json');
var config = require('..\\config.json');

var accountsEndPoint = endPoints.accounts.accountsEndPoint;
var accountsByIdEndPoint = endPoints.accounts.accountsByIdEndPoint;
var accountSummariesEndPoint = endPoints.accounts.accountSummariesEndPoint;
var accountMembershipsEndPoint = endPoints.accounts.accountMembershipsEndPoint;
var accountMembershipEndPoint = endPoints.accounts.accountMembershipEndPoint;

var tokenHeader = config.tokenHeader;

var getAccounts = function(token, callback){
	console.log('Getting all accounts...');
	console.log('GET ' + accountsEndPoint);
	request
		.get(accountsEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
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
		.set(tokenHeader, token)
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
		.set(tokenHeader, token)
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
		.set(tokenHeader, token)
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
		.set(tokenHeader, token)
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

var getAccountMembership = function(ids, token, callback){
	console.log('Getting the membership...');
	var accMembershipEndPoint = accountMembershipEndPoint
									.replace('{account_id}', ids.accountId)
									.replace('{person_id}', ids.personId);
	console.log('GET ' + accMembershipEndPoint);
	
	request
		.get(accMembershipEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
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
		.set(tokenHeader, token)
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

var deleteAccountMember = function(ids, token, callback){
	console.log('Deleting the membership...');
	var accMembershipEndPoint = accountMembershipEndPoint
									.replace('{account_id}', ids.accountId)
									.replace('{person_id}', ids.personId);
	console.log('DELETE ' + accMembershipEndPoint);

	request
		.del(accMembershipEndPoint)
		.proxy(proxy)
		.set(tokenHeader, token)
		.set('Content-Type', 'application/json')
	.end(function(err, res){
		if(err){
			console.log('Error when deleting the account membership...');
			console.log('Error...' + JSON.stringify(err));
		}
		else{
			console.log('The membership has been deleted in the account: ' + ids.accountId + ' response status is: ' + JSON.stringify(res.status));
		}
		callback(res);
	});
};
exports.deleteAccountMember = deleteAccountMember;
