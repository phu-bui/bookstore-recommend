const tf = require('@tensorflow/tfjs-node')
const books = require("./data/web_book_data.json")



async function loadModel() {
	console.log('Loading Model...')
	home_ = process.cwd()
	model_path = "file://"+ home_ + "/model/model.json"
	model = await tf.loadLayersModel(model_path)
	console.log('Model Loaded Successfull')
}

const book_arr = tf.range(0, books.length)
const book_len = books.length


exports.recommend = async function recommend(userId) {
	let user = tf.fill([book_len], Number(userId))
	let book_in_js_array = book_arr.arraySync()
	await loadModel()
	console.log(`Recommending for User: ${userId}`)
	pred_tensor = await model.predict([book_arr, user]).reshape([10000])
	pred = pred_tensor.arraySync()
	
	let recommendations = []
	for (let i = 0; i < 6; i++) {
		max = pred_tensor.argMax().arraySync()
		recommendations.push(books[max]) //Push book with highest prediction probability
		pred.splice(max, 1)    //drop from array
		pred_tensor = tf.tensor(pred) //create a new tensor
	}
	
	return recommendations
	
	
}
