import { configureStore } from "@reduxjs/toolkit";
import classificationReducer, {
    setQuestionVote,
    setSelectedBdoClass,
    resetVotes,
    setAnswerSummary,
    setVotesByClass,
} from "./classification";

describe("classification slice", () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                classification: classificationReducer,
            },
        });
    });

    it("deve atualizar o voto para uma pergunta específica", () => {
        store.dispatch(setQuestionVote({ questionId: "1", vote: 5 }));
        const state = store.getState().classification;
        expect(state.votesByQuestion["1"]).toBe(5);
    });

    it("deve definir a classe BDO selecionada e redefinir os votos", () => {
        store.dispatch(setQuestionVote({ questionId: "1", vote: 5 }));
        store.dispatch(setSelectedBdoClass("Warrior"));
        const state = store.getState().classification;
        expect(state.selectedBdoClass).toBe("Warrior");
        expect(state.votesByQuestion["1"]).toBeUndefined();
    });

    it("deve redefinir todos os votos", () => {
        store.dispatch(setQuestionVote({ questionId: "1", vote: 5 }));
        store.dispatch(resetVotes());
        const state = store.getState().classification;
        expect(state.votesByQuestion["1"]).toBeUndefined();
    });

    it("deve definir o resumo das respostas corretamente", () => {
        const answerSummary = [
            {
                bdo_class: 1,
                resume: {
                    "1": [{ text: "Awakening Skill 1", avg_votes: 4.5 }],
                    "2": [{ text: "Succession Skill 1", avg_votes: 3.5 }],
                },
            },
        ];
        store.dispatch(setAnswerSummary(answerSummary));
        const state = store.getState().classification;
        expect(state.answerSummary).toEqual(answerSummary);
    });

    it("deve definir os votos por classe corretamente", () => {
        const votesByClass = [
            { data: 10, color: "#000", label: "Warrior" },
            { data: 20, color: "#0f0", label: "Ranger" },
        ];
        store.dispatch(setVotesByClass(votesByClass));
        const state = store.getState().classification;
        expect(state.votesByClass).toEqual(votesByClass);
    });
});
