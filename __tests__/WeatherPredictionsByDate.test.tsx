import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { WeatherPredictionsByDate } from "@/components/WeatherPredictionsByDate";


// Mocks
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockAxios = axios as jest.Mocked<typeof axios>;

describe("WeatherPredictionsByDate", () => {
  const setModalOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form fields", () => {
    render(<WeatherPredictionsByDate setModalOpen={setModalOpen} />);

    expect(screen.getByTestId("country")).toBeInTheDocument();
    expect(screen.getByTestId("state")).toBeInTheDocument();
    expect(screen.getByTestId("start-date")).toBeInTheDocument();
    expect(screen.getByTestId("end-date")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
  });

  test("updates country and loads corresponding states", async () => {
    render(<WeatherPredictionsByDate setModalOpen={setModalOpen} />);

    const countrySelect = screen.getByTestId("country");
    fireEvent.change(countrySelect, { target: { value: "Nigeria" } });

    const stateSelect = screen.getByTestId("state") as HTMLSelectElement;
    await waitFor(() => {
      expect(stateSelect.options.length).toBeGreaterThan(0);
    });
  });

  test("sets start and end dates", async () => {
    render(<WeatherPredictionsByDate setModalOpen={setModalOpen} />);
    const startInput = screen.getByTestId("start-date") as HTMLInputElement;
    const endInput = screen.getByTestId("end-date") as HTMLInputElement;

    fireEvent.change(startInput, { target: { value: "2023-09-01" } });
    fireEvent.change(endInput, { target: { value: "2023-09-03" } });

    expect(startInput).toHaveValue("2023-09-01");
    expect(endInput).toHaveValue("2023-09-03");
  });

  

// test("fetches weather data on search", async () => {
//   mockAxios.get.mockResolvedValueOnce({
//     data: {
//       days: [
//         {
//           datetime: "2023-09-01",
//           temp: 30,
//           windspeed: 10,
//           description: "Clear sky",
//           conditions: "Clear",
//           icon: "day-sunny",
//         },
//       ],
//     },
//   });

//   render(<WeatherPredictionsByDate setModalOpen={setModalOpen} />);

//   await userEvent.selectOptions(screen.getByTestId("country"), "Nigeria");
//   await userEvent.selectOptions(screen.getByTestId("state"), "Lagos");
//   await userEvent.type(screen.getByTestId("start-date"), "2023-09-01");
//   await userEvent.type(screen.getByTestId("end-date"), "2023-09-03");

//   fireEvent.click(screen.getByTestId("search-button"));

//   await waitFor(() => {
//     expect(mockAxios.get).toHaveBeenCalled();
//     expect(toast.success).toHaveBeenCalledWith("Forecast fetched Success");
//     expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
//   });
// });


//   test("filters weather by condition", async () => {
//     const weatherMock = {
//       data: {
//         days: [
//           {
//             datetime: "2023-09-01",
//             temp: 30,
//             windspeed: 10,
//             description: "Clear sky",
//             conditions: "Clear",
//             icon: "day-sunny",
//           },
//           {
//             datetime: "2023-09-02",
//             temp: 28,
//             windspeed: 8,
//             description: "Rainy",
//             conditions: "Rain",
//             icon: "rain",
//           },
//         ],
//       },
//     };

//     mockAxios.get.mockResolvedValueOnce(weatherMock);

//     render(<WeatherPredictionsByDate setModalOpen={setModalOpen} />);
//     fireEvent.click(screen.getByTestId("search-button"));

//     await waitFor(() => {
//       expect(screen.getByTestId("condition-filter")).toBeInTheDocument();
//     });

//     const filterSelect = screen.getByTestId("condition-filter") as HTMLSelectElement;
//     fireEvent.change(filterSelect, { target: { value: "Rain" } });

//     await waitFor(() => {
//       expect(screen.getByText("Rainy")).toBeInTheDocument();
//       expect(screen.queryByText("Clear sky")).not.toBeInTheDocument();
//     });
//   });
});
