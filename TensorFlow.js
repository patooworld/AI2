const tf = require('@tensorflow/tfjs');

// ... (Data loading and preprocessing)

const model = tf.sequential();
model.add(tf.layers.dense({units: 128, activation: 'relu', inputShape: [input_dim]}));
model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

model.compile({optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy']});

model.fit(xs, ys, {epochs: 10}).then(() => {
  // ... (Evaluation and prediction)
});
