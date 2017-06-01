import expect from 'expect';
import * as actions from '../../src/actions/EnvActions';
import types from '../../src/constants/ActionTypes';

describe("changeIsMobile", () => {
    it("should create a CHANGE_IS_MOBILE action", () => {
        expect(actions.changeIsMobile(true), {
            type: types.CHANGE_IS_MOBILE,
            isMobile: true
        });
    });
});

describe("changeWidthAndHeight", () => {
    it("should create a CHANGE_WIDTH_AND_HEIGHT action", () => {
        const width = 1024;
        const height = 768;
        expect(actions.changeWidthAndHeight(width, height), {
            type: types.CHANGE_WIDTH_AND_HEIGHT,
            width,
            height
        });
    });
});
