import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import ComponentWrapper from './page';
import configurationReducer from '@/lib/features/configuration';
import classificationReducer from '@/lib/features/classification';

// Mocking hooks
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('react-intersection-observer', () => ({
    useInView: jest.fn(),
}));

jest.mock('@/lib/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn((selector) => selector(mockStore.getState())),
}));

jest.mock('@/services/classification', () => ({
    getAllBdoClass: jest.fn(),
    getAnswerByClass: jest.fn(),
    getAnswerSummary: jest.fn(),
    getTotalVotes: jest.fn(),
}));

jest.mock('chart.js', () => ({
        ...jest.requireActual('chart.js'),
        Chart: jest.fn().mockImplementation(() => ({
            register: jest.fn(),
            destroy: jest.fn(),
            update: jest.fn(),
            render: jest.fn(),
            resize: jest.fn(),
            config: {
                data: {
                    datasets: [],
                },
            },
        })),
        registerables: [],
}));

jest.mock('react-chartjs-2', () => ({
    __esModule: true,
    Bar: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Line: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Pie: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Doughnut: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    PolarArea: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Radar: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Bubble: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    Scatter: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
    defaults: {},
    Chart: {
        register: jest.fn(),
    },
}));

const mockStore = configureStore({
    reducer: {
        configuration: configurationReducer,
        classification: classificationReducer,
    },
    preloadedState: {
        configuration: {
            class: [
                { id: 1, name: 'Warrior', abbreviation: 'WR', color: '#000' },
                { id: 2, name: 'Ranger', abbreviation: 'RG', color: '#0f0' },
            ],
        },
        classification: {
            votesByClass: [
                { data: 10, color: '#000', label: 'Warrior' },
                { data: 20, color: '#0f0', label: 'Ranger' },
            ],
            answerSummary: [
                {
                    bdo_class: 1,
                    resume: {
                        '1': [{ text: 'Awakening Skill 1', avg_votes: 4.5 }],
                        '2': [{ text: 'Succession Skill 1', avg_votes: 3.5 }],
                    },
                },
            ],
        },
    },
});

describe.skip('Rank Page', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
            pathname: '/rank',
            query: {},
        });

        (useInView as jest.Mock).mockReturnValue({
            ref: jest.fn(),
            inView: true,
        });
    });

    it('renders the rank page with class options', () => {
        render(
            <Provider store={mockStore}>
                <ComponentWrapper />
            </Provider>
        );

        expect(screen.getByText('Ranking de Classes')).toBeInTheDocument();
        expect(screen.getByText('Warrior')).toBeInTheDocument();
        expect(screen.getByText('Ranger')).toBeInTheDocument();
    });

    it('displays the selected class details when a class is clicked', () => {
        render(
            <Provider store={mockStore}>
                <ComponentWrapper />
            </Provider>
        );

        fireEvent.click(screen.getByText('WR'));

        expect(screen.getByText('DESPERTAR')).toBeInTheDocument();
        expect(screen.getByText('Awakening Skill 1')).toBeInTheDocument();
        expect(screen.getByText('SUCESSÃO')).toBeInTheDocument();
        expect(screen.getByText('Succession Skill 1')).toBeInTheDocument();
    });

    it('shows no data message when there is no answer summary', () => {
        const customStore = configureStore({
            reducer: {
                configuration: configurationReducer,
                classification: classificationReducer,
            },
            preloadedState: {
                configuration: {
                    class: [
                        { id: 1, name: 'Warrior', abbreviation: 'WR', color: '#000' },
                    ],
                },
                classification: {
                    votesByClass: [
                        { data: 10, color: '#000', label: 'Warrior' },
                    ],
                    answerSummary: [],
                },
            },
        });

        render(
            <Provider store={customStore}>
                <ComponentWrapper />
            </Provider>
        );

        fireEvent.click(screen.getByText('WR'));

        expect(screen.getByText('Sem dados')).toBeInTheDocument();
    });
});