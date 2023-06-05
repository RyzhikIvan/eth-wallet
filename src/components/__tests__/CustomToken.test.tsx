import { render, screen, fireEvent } from '@testing-library/react';
import CustomToken from '../CustomToken';

describe('CustomToken', () => {
  const addCustomToken = jest.fn();
  const customTokens = ['token1', 'token2'];

  beforeEach(() => {
    render(<CustomToken addCustomToken={addCustomToken} customTokens={customTokens} />);
  });

  it('renders without errors', () => {
    expect(() => screen.getByPlaceholderText('Add Custom Token')).not.toThrow();
    expect(() => screen.getByText('Add')).not.toThrow();
  });

  it('calls addCustomToken with the correct token address when submitted', () => {
    const input = screen.getByPlaceholderText('Add Custom Token');
    const submitButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'newTokenAddress' } });
    fireEvent.click(submitButton);

    expect(addCustomToken).toHaveBeenCalledWith('newTokenAddress');
  });

  it('clears the input after submission', () => {
    const input = screen.getByPlaceholderText('Add Custom Token') as HTMLInputElement;
    const submitButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'newTokenAddress' } });
    fireEvent.click(submitButton);

    expect(input.value).toBe('');
  });

  it('enables the submit button when the input is valid', () => {
    const input = screen.getByPlaceholderText('Add Custom Token');
    const submitButton = screen.getByText('Add') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'validTokenAddress' } });

    expect(submitButton.disabled).toBe(false);
  });
});
