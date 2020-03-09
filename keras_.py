import numpy as np

x = np.array([1,2,3,4,5,6,7,8,9,10])
y = np.array([1,2,3,4,5,6,7,8,9,10])

x_train = x[:7]
y_train = y[:7]
x_test = x[7:]
y_test = y[7:]

print(x_train)
print(x_test)

from keras.layers import Dense, Activation
from keras.models import Sequential

model = Sequential()

model.add(Dense(1000000, input_dim = 1, activation = 'relu'))
model.add(Dense(5, activation='relu'))
model.add(Dense(1))

model.compile(loss='mse', optimizer = 'adam')

model.fit(x_train, y_train, epochs = 200, batch_size=1)

y_predict = model.predict(x_test)

print(y_predict)

#r2 구하기
from sklearn.metrics import r2_score
re_predict = r2_score(y_test, y_predict)
print("R2: ", re_predict)