import { getWeatherForeCast } from '../__mocks__/Forecasts';
import axiosInstance from '@/app/api/axios';

jest.mock('../src/api/axios');

it('Returns weather forecast response', async () => {
  const mockedData = {
    address: 'American Samoa',
    days: [
      {
        datetime: '2025-03-04',
        tempmax: 31.7,
        conditions: 'Clear',
      },
    ],
  };

  const mockedGet = axiosInstance.get as jest.Mock;
  mockedGet.mockResolvedValueOnce({ data: mockedData });

  const apiData = await getWeatherForeCast('American Samoa');
  expect(apiData).toEqual(mockedData);
});

it('Handles API errors well', async () => {
  const mockedGet = axiosInstance.get as jest.Mock;
  mockedGet.mockRejectedValueOnce(new Error('Network error'));

  await expect(getWeatherForeCast('Lagos')).rejects.toThrow('Network error');
});
