export default class IrregularKernel{
    constructor(offsets=null, kernelHelpers=null){
        //this.offsets = null;
        if (offsets !== null){
            this.offsets = offsets;
        }
        //for a composition of kernels
        if (kernelHelpers !== null){
            offsets = [];
            //TODO
        }
    }

    get offsets(){
        return this.offsets;
    }

    set offsets(value){
        this.offsets = value;
    }
}