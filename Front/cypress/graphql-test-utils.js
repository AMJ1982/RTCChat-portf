export const hasOperationName = (req, operationName) => {
	const { body } = req
	return body.hasOwnProperty('operationName') && body.operationName === operationName
}

export const aliasMutation = (req, operationName) => {
	if (hasOperationName(req, operationName)) {
		req.alias = `gql${operationName}Mutation`
	}
}