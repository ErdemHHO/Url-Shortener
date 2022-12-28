const mongoose = require('mongoose')
const shortId = require('shortid')

const UrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  kısaltılmısUrl: {
    type: String,
    required: true,
    default:shortId.generate
  },
  tıklanma: {
    type: Number,
    required: true,
    default: 0
  },
  tarih: {
      type: Date,
      default: new Date()
  },
})

module.exports = mongoose.model('Url', UrlSchema)