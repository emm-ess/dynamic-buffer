const DEFAULT_OPTIONS = {
    initialSize: 8192,
    incrementAmount: 8192
}

module.exports = function DynamicBuffer(_options) {
    const options = {}
    Object.assign(options, DEFAULT_OPTIONS, _options)

    buffer = Buffer.alloc(options.initialSize)
    size = 0

    function increaseIfNeeded(additionalSize){
        const freeSpace = buffer.length - size
        if(freeSpace < additionalSize){
            const factor = Math.ceil((additionalSize - freeSpace) / options.incrementAmount)
            const newSize = buffer.length + (options.incrementAmount * factor)
            const newBuffer = Buffer.alloc(newSize)
            buffer.copy(newBuffer, 0, 0, size)
            buffer = newBuffer
        }
    }

    function write(data){
        if(Buffer.isBuffer(data)){
            increaseIfNeeded(data.length)
            data.copy(buffer, size, 0)
            size += data.length
        }
        else {
            data = '' + data
            const additionalSize = Buffer.byteLength(data)
            increaseIfNeeded(additionalSize)
            buffer.write(data, size, 'utf8')
            size += additionalSize
        }
    }

    function getContents(){
        const data = Buffer.alloc(size)
        buffer.copy(data, 0, 0, size)
        return data
    }

    return {
        size: () => size,
        write, getContents
    }
}