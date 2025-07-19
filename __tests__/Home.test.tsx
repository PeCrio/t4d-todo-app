import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FilterProvider } from '@/store/FilterContext';
import Home from '@/app/page';
import { TagProvider } from '@/store/TagContext';
import { mockTodoList } from '../__mocks__/TodoLists';

jest.mock('../src/utils/LocalStorageService', () => ({
  LocalStorageService: {
    get: jest.fn(() => mockTodoList),
    set: jest.fn(),
  },
})
)

const renderWithProviders = () => {
  render(
    <TagProvider>
      <FilterProvider>
        <Home />
      </FilterProvider>
    </TagProvider>
  );
};

it('should have Todo Lists', async () => {
    renderWithProviders() // ARRANGE

    const myElem = await screen.findByText(/todo lists/i); //ACT
    expect(myElem).toBeInTheDocument() //ASSERT
})

it('filtering of respective status works', async () => {
    renderWithProviders()

    const myElem = await screen.findByText(/todo lists/i);
    expect(myElem).toBeInTheDocument()
})

it('Todo List shows all tasks initially', async () => {
    renderWithProviders();

    const todayTasks = await screen.findAllByText(/Today Task/i);
    const oldTask = await screen.findAllByText(/Old Task/i);

    expect(todayTasks.length).toBeGreaterThan(0);
    expect(oldTask[0]).toBeInTheDocument();
});

it('Filters works well based on date parameter', async () => {
    renderWithProviders();

    fireEvent.click(screen.getByText(/today/i));
    const todayTasks = await screen.findAllByText(/Today Task/i);

    expect(todayTasks[0]).toBeInTheDocument();
    await waitFor(() => {
        expect(screen.queryByText(/Old Task/i)).not.toBeInTheDocument();
    });
})