'use strict';

describe('PIXI.Container', () =>
{
    describe('parent', () =>
    {
        it('should be present when adding children to Container', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            expect(container.children.length).to.be.equals(0);
            container.addChild(child);
            expect(container.children.length).to.be.equals(1);
            expect(child.parent).to.be.equals(container);
        });
    });

    describe('events', () =>
    {
        it('should trigger "added" and "removed" events on its children', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();
            let triggeredAdded = false;
            let triggeredRemoved = false;

            child.on('added', (to) =>
            {
                triggeredAdded = true;
                expect(container.children.length).to.be.equals(1);
                expect(child.parent).to.be.equals(to);
            });
            child.on('removed', (from) =>
            {
                triggeredRemoved = true;
                expect(container.children.length).to.be.equals(0);
                expect(child.parent).to.be.null;
                expect(container).to.be.equals(from);
            });

            container.addChild(child);
            expect(triggeredAdded).to.be.true;
            expect(triggeredRemoved).to.be.false;

            container.removeChild(child);
            expect(triggeredRemoved).to.be.true;
        });
    });

    describe('addChild', () =>
    {
        it('should remove from current parent', () =>
        {
            const parent = new PIXI.Container();
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            assertRemovedFromParent(parent, container, child, () => { container.addChild(child); });
        });

        it('should call onChildrenChange', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();
            const spy = sinon.spy(container, 'onChildrenChange');

            container.addChild(child);

            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(0);
        });
    });

    describe('removeChildAt', () =>
    {
        it('should remove from current parent', () =>
        {
            const parent = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            assertRemovedFromParent(parent, null, child, () => { parent.removeChildAt(0); });
        });

        it('should call onChildrenChange', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child);

            const spy = sinon.spy(container, 'onChildrenChange');

            container.removeChildAt(0);
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(0);
        });
    });

    describe('addChildAt', () =>
    {
        it('should allow placements at start', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(new PIXI.DisplayObject());
            container.addChildAt(child, 0);

            expect(container.children.length).to.be.equals(2);
            expect(container.children[0]).to.be.equals(child);
        });

        it('should allow placements at end', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(new PIXI.DisplayObject());
            container.addChildAt(child, 1);

            expect(container.children.length).to.be.equals(2);
            expect(container.children[1]).to.be.equals(child);
        });

        it('should throw on out-of-bounds', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(new PIXI.DisplayObject());

            expect(() => container.addChildAt(child, -1)).to.throw('The index -1 supplied is out of bounds 1');
            expect(() => container.addChildAt(child, 2)).to.throw('The index 2 supplied is out of bounds 1');
        });

        it('should remove from current parent', () =>
        {
            const parent = new PIXI.Container();
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            assertRemovedFromParent(parent, container, child, () => { container.addChildAt(child, 0); });
        });

        it('should call onChildrenChange', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(new PIXI.DisplayObject());

            const spy = sinon.spy(container, 'onChildrenChange');

            container.addChildAt(child, 0);

            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(0);
        });
    });

    describe('removeChild', () =>
    {
        it('should ignore non-children', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child);

            container.removeChild(new PIXI.DisplayObject());

            expect(container.children.length).to.be.equals(1);
        });

        it('should remove all children supplied', () =>
        {
            const container = new PIXI.Container();
            const child1 = new PIXI.DisplayObject();
            const child2 = new PIXI.DisplayObject();

            container.addChild(child1, child2);

            expect(container.children.length).to.be.equals(2);

            container.removeChild(child1, child2);

            expect(container.children.length).to.be.equals(0);
        });

        it('should call onChildrenChange', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child);

            const spy = sinon.spy(container, 'onChildrenChange');

            container.removeChild(child);

            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(0);
        });
    });

    describe('getChildIndex', () =>
    {
        it('should return the correct index', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(new PIXI.DisplayObject(), child, new PIXI.DisplayObject());

            expect(container.getChildIndex(child)).to.be.equals(1);
        });

        it('should throw when child does not exist', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            expect(() => container.getChildIndex(child))
                .to.throw('The supplied DisplayObject must be a child of the caller');
        });
    });

    describe('getChildAt', () =>
    {
        it('should throw when out-of-bounds', () =>
        {
            const container = new PIXI.Container();

            expect(() => container.getChildAt(-1)).to.throw('getChildAt: Index (-1) does not exist.');
            expect(() => container.getChildAt(1)).to.throw('getChildAt: Index (1) does not exist.');
        });
    });

    describe('setChildIndex', () =>
    {
        it('should throw on out-of-bounds', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child);

            expect(() => container.setChildIndex(child, -1)).to.throw('The supplied index is out of bounds');
            expect(() => container.setChildIndex(child, 1)).to.throw('The supplied index is out of bounds');
        });

        it('should throw when child does not belong', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(new PIXI.DisplayObject());

            expect(() => container.setChildIndex(child, 0))
                .to.throw('The supplied DisplayObject must be a child of the caller');
        });

        it('should set index', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child, new PIXI.DisplayObject(), new PIXI.DisplayObject());
            expect(container.children.indexOf(child)).to.be.equals(0);

            container.setChildIndex(child, 1);
            expect(container.children.indexOf(child)).to.be.equals(1);

            container.setChildIndex(child, 2);
            expect(container.children.indexOf(child)).to.be.equals(2);

            container.setChildIndex(child, 0);
            expect(container.children.indexOf(child)).to.be.equals(0);
        });

        it('should call onChildrenChange', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child, new PIXI.DisplayObject());

            const spy = sinon.spy(container, 'onChildrenChange');

            container.setChildIndex(child, 1);

            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(1);
        });
    });

    describe('swapChildren', () =>
    {
        it('should call onChildrenChange', () =>
        {
            const container = new PIXI.Container();
            const child1 = new PIXI.DisplayObject();
            const child2 = new PIXI.DisplayObject();

            container.addChild(child1, child2);

            const spy = sinon.spy(container, 'onChildrenChange');

            container.swapChildren(child1, child2);
            expect(spy).to.have.been.called;
            expect(spy).to.have.been.calledWith(0);

            // second call required to complete returned index coverage
            container.swapChildren(child1, child2);
            expect(spy).to.have.been.calledTwice;
            expect(spy).to.have.been.calledWith(0);
        });

        it('should not call onChildrenChange if supplied children are equal', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child, new PIXI.DisplayObject());

            const spy = sinon.spy(container, 'onChildrenChange');

            container.swapChildren(child, child);

            expect(spy).to.not.have.been.called;
        });

        it('should throw if children do not belong', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.Container();

            container.addChild(child, new PIXI.DisplayObject());

            expect(() => container.swapChildren(child, new PIXI.DisplayObject()))
                .to.throw('The supplied DisplayObject must be a child of the caller');
            expect(() => container.swapChildren(new PIXI.DisplayObject(), child))
                .to.throw('The supplied DisplayObject must be a child of the caller');
        });

        it('should result in swapped child positions', () =>
        {
            const container = new PIXI.Container();
            const child1 = new PIXI.DisplayObject();
            const child2 = new PIXI.DisplayObject();

            container.addChild(child1, child2);

            expect(container.children.indexOf(child1)).to.be.equals(0);
            expect(container.children.indexOf(child2)).to.be.equals(1);

            container.swapChildren(child1, child2);

            expect(container.children.indexOf(child2)).to.be.equals(0);
            expect(container.children.indexOf(child1)).to.be.equals(1);
        });
    });

    describe('render', () =>
    {
        it('should not render when object not visible', () =>
        {
            const container = new PIXI.Container();
            const webGLSpy = sinon.spy(container._renderWebGL);
            const canvasSpy = sinon.spy(container._renderCanvas);

            container.visible = false;

            container.renderWebGL();
            expect(webGLSpy).to.not.have.been.called;

            container.renderCanvas();
            expect(canvasSpy).to.not.have.been.called;
        });

        it('should not render when alpha is zero', () =>
        {
            const container = new PIXI.Container();
            const webGLSpy = sinon.spy(container._renderWebGL);
            const canvasSpy = sinon.spy(container._renderCanvas);

            container.worldAlpha = 0;

            container.renderWebGL();
            expect(webGLSpy).to.not.have.been.called;

            container.renderCanvas();
            expect(canvasSpy).to.not.have.been.called;
        });

        it('should not render when object not renderable', () =>
        {
            const container = new PIXI.Container();
            const webGLSpy = sinon.spy(container._renderWebGL);
            const canvasSpy = sinon.spy(container._renderCanvas);

            container.renderable = false;

            container.renderWebGL();
            expect(webGLSpy).to.not.have.been.called;

            container.renderCanvas();
            expect(canvasSpy).to.not.have.been.called;
        });

        it('should render children', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.Container();
            const webGLSpy = sinon.spy(child, '_renderWebGL');
            const canvasSpy = sinon.spy(child, '_renderCanvas');

            container.addChild(child);

            container.renderWebGL();
            expect(webGLSpy).to.have.been.called;

            container.renderCanvas();
            expect(canvasSpy).to.have.been.called;
        });
    });

    describe('removeChildren', () =>
    {
        it('should remove all children when no arguments supplied', () =>
        {
            const container = new PIXI.Container();
            let removed = [];

            container.addChild(new PIXI.DisplayObject(), new PIXI.DisplayObject(), new PIXI.DisplayObject());

            expect(container.children.length).to.be.equals(3);

            removed = container.removeChildren();

            expect(container.children.length).to.be.equals(0);
            expect(removed.length).to.be.equals(3);
        });

        it('should return empty array if no children', () =>
        {
            const container = new PIXI.Container();
            const removed = container.removeChildren();

            expect(removed.length).to.be.equals(0);
        });

        it('should handle a range greater than length', () =>
        {
            const container = new PIXI.Container();
            let removed = [];

            container.addChild(new PIXI.DisplayObject());

            removed = container.removeChildren(0, 2);
            expect(removed.length).to.be.equals(1);
        });

        it('should throw outside acceptable range', () =>
        {
            const container = new PIXI.Container();

            container.addChild(new PIXI.DisplayObject());

            expect(() => container.removeChildren(2))
                .to.throw('removeChildren: numeric values are outside the acceptable range.');
            expect(() => container.removeChildren(-1))
                .to.throw('removeChildren: numeric values are outside the acceptable range.');
            expect(() => container.removeChildren(-1, 1))
                .to.throw('removeChildren: numeric values are outside the acceptable range.');
        });
    });

    describe('destroy', () =>
    {
        it('should not destroy children by default', () =>
        {
            const container = new PIXI.Container();
            const child = new PIXI.DisplayObject();

            container.addChild(child);
            container.destroy();

            expect(container.children.length).to.be.equals(0);
            expect(child.transform).to.not.be.null;
        });

        it('should allow children destroy', () =>
        {
            let container = new PIXI.Container();
            let child = new PIXI.DisplayObject();

            container.addChild(child);
            container.destroy({ children: true });

            expect(container.children.length).to.be.equals(0);
            expect(container.transform).to.be.null;
            expect(child.transform).to.be.null;

            container = new PIXI.Container();
            child = new PIXI.DisplayObject();

            container.addChild(child);
            container.destroy(true);

            expect(container.children.length).to.be.equals(0);
            expect(container.transform).to.be.null;
            expect(child.transform).to.be.null;
        });
    });

    describe('width', () =>
    {
        it('should reflect scale', () =>
        {
            const container = new PIXI.Container();
            const graphics = new PIXI.Graphics();

            graphics.drawRect(0, 0, 10, 10);
            container.addChild(graphics);
            container.scale.x = 2;

            expect(container.width).to.be.equals(20);
        });

        it('should adjust scale', () =>
        {
            const container = new PIXI.Container();
            const graphics = new PIXI.Graphics();

            graphics.drawRect(0, 0, 10, 10);
            container.addChild(graphics);

            container.width = 20;

            expect(container.width).to.be.equals(20);
            expect(container.scale.x).to.be.equals(2);
        });

        it('should reset scale', () =>
        {
            const container = new PIXI.Container();

            container.scale.x = 2;
            container.width = 5;

            expect(container.width).to.be.equals(0);
            expect(container.scale.x).to.be.equals(1);
        });
    });

    describe('height', () =>
    {
        it('should reflect scale', () =>
        {
            const container = new PIXI.Container();
            const graphics = new PIXI.Graphics();

            graphics.drawRect(0, 0, 10, 10);
            container.addChild(graphics);
            container.scale.y = 2;

            expect(container.height).to.be.equals(20);
        });

        it('should adjust scale', () =>
        {
            const container = new PIXI.Container();
            const graphics = new PIXI.Graphics();

            graphics.drawRect(0, 0, 10, 10);
            container.addChild(graphics);

            container.height = 20;

            expect(container.height).to.be.equals(20);
            expect(container.scale.y).to.be.equals(2);
        });

        it('should reset scale', () =>
        {
            const container = new PIXI.Container();

            container.scale.y = 2;
            container.height = 5;

            expect(container.height).to.be.equals(0);
            expect(container.scale.y).to.be.equals(1);
        });
    });

    function assertRemovedFromParent(parent, container, child, functionToAssert)
    {
        parent.addChild(child);

        expect(parent.children.length).to.be.equals(1);
        expect(child.parent).to.be.equals(parent);

        functionToAssert();

        expect(parent.children.length).to.be.equals(0);
        expect(child.parent).to.be.equals(container);
    }
});
