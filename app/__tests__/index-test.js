import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Index from '@/app/index'; // Adjust the import based on your file structure
import { useRouter } from 'expo-router';

// Mock the useRouter hook
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('Index Component', () => {
    let router;

    beforeEach(() => {
        router = {
            push: jest.fn(),
            replace: jest.fn(),
        };
        useRouter.mockReturnValue(router);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText, getByLabelText } = render(<Index />);
        
        // Check if the Welcome text is rendered
        expect(getByText('Welcome')).toBeTruthy();
        // Check if the "Create An Account" button is rendered
        expect(getByText('Create An Account')).toBeTruthy();
        // Check if the "Log In" button is rendered
        expect(getByText('Log In')).toBeTruthy();
    });

    it('navigates to the sign-up page on button press', () => {
        const { getByText } = render(<Index />);

        // Simulate press on the "Create An Account" button
        fireEvent.press(getByText('Create An Account'));

        // Assert that router.push was called with the correct argument
        expect(router.push).toHaveBeenCalledWith('auth/sign_up');
    });

    it('navigates to the sign-in page on button press', () => {
        const { getByText } = render(<Index />);

        // Simulate press on the "Log In" button
        fireEvent.press(getByText('Log In'));

        // Assert that router.push was called with the correct argument
        expect(router.push).toHaveBeenCalledWith('/auth/sign_in');
    });
});
