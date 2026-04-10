
// import mongoose from 'mongoose';

// const messageSchema = new mongoose.Schema({
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   isAlert: { type: Boolean, default: false }
// });

// const conversationSchema = new mongoose.Schema({
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   messages: [messageSchema],
//   lastActivity: { type: Date, default: Date.now }
// });

// export default mongoose.model('Conversation', conversationSchema);




























import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isAlert: { type: Boolean, default: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  lastActivity: { type: Date, default: Date.now }
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;