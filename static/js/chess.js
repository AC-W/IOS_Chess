// black_pawn_img = document.getElementById('black_pawn')
// white_pawn_img = document.getElementById('white_pawn')

// black_knight_img = document.getElementById('black_knight')
// white_knight_img = document.getElementById('white_knight')

// black_rook_img = document.getElementById('black_rook')
// white_rook_img = document.getElementById('white_rook')

// black_bishop_img = document.getElementById('black_bishop')
// white_bishop_img = document.getElementById('white_bishop')

// black_queen_img = document.getElementById('black_queen')
// white_queen_img = document.getElementById('white_queen')

// black_king_img = document.getElementById('black_king')
// white_king_img = document.getElementById('white_king')

class chess{
    constructor(block_size){
        var x = new Array(8);
        for (var y = 0; y < x.length;y++){
            x[y] = new Array(8);
        }
        for (var a = 0; a < x.length;a++){
            for (var b = 0; b < x[a].length;b++){
                x[a][b] = new piece()
            }
        }
        this.board = x;
        this.reset_board();
        this.block_size = block_size;
        

        this.back_wins = false
        this.white_wins = false
        this.tie = false

        this.turn = -1

        this.dic = {
            0: 'a',
            1: 'b',
            2: 'c',
            3: 'd',
            4: 'e',
            5: 'f',
            6: 'g',
            7: 'h',
            'a': 0,
            'b': 1,
            'c': 2,
            'd': 3,
            'e': 4,
            'f': 5,
            'g': 6,
            'h': 7,
          };
        
    }

    reset_board(){
        this.board[0][0] = new rook('black',black_rook_img)
        this.board[1][0] = new knight('black',black_knight_img)
        this.board[2][0] = new bishop('black',black_bishop_img)
        this.board[3][0] = new queen('black',black_queen_img)
        this.board[4][0] = new king('black',black_king_img)
        this.board[5][0] = new bishop('black',black_bishop_img)
        this.board[6][0] = new knight('black',black_knight_img)
        this.board[7][0] = new rook('black',black_rook_img)

        this.board[0][1] = new pawn('black',black_pawn_img)
        this.board[1][1] = new pawn('black',black_pawn_img)
        this.board[2][1] = new pawn('black',black_pawn_img)
        this.board[3][1] = new pawn('black',black_pawn_img)
        this.board[4][1] = new pawn('black',black_pawn_img)
        this.board[5][1] = new pawn('black',black_pawn_img)
        this.board[6][1] = new pawn('black',black_pawn_img)
        this.board[7][1] = new pawn('black',black_pawn_img)

        this.board[0][7] = new rook('white',white_rook_img)
        this.board[1][7] = new knight('white',white_knight_img)
        this.board[2][7] = new bishop('white',white_bishop_img)
        this.board[3][7] = new queen('white',white_queen_img)
        this.board[4][7] = new king('white',white_king_img)
        this.board[5][7] = new bishop('white',white_bishop_img)
        this.board[6][7] = new knight('white',white_knight_img)
        this.board[7][7] = new rook('white',white_rook_img)

        this.board[0][6] = new pawn('white',white_pawn_img)
        this.board[1][6] = new pawn('white',white_pawn_img)
        this.board[2][6] = new pawn('white',white_pawn_img)
        this.board[3][6] = new pawn('white',white_pawn_img)
        this.board[4][6] = new pawn('white',white_pawn_img)
        this.board[5][6] = new pawn('white',white_pawn_img)
        this.board[6][6] = new pawn('white',white_pawn_img)
        this.board[7][6] = new pawn('white',white_pawn_img)

        for (var a = 0; a < 8;a++){
            for(var b = 0;b < 8; b++){
                this.board[a][b].x = a*this.block_size
                this.board[a][b].y = b*this.block_size
            }
        }
    }

    draw(ctx,pieces=true){
        ctx.clearRect(0, 0, game_pieces.width, game_pieces.height)
        for (var a = 0; a < 8;a++){
            for(var b = 0;b < 8; b++){
                this.board[a][b].draw(ctx,pieces)
            }
        }
    }

    clear(){
        for (var a = 0; a < 8;a++){
            for(var b = 0;b < 8; b++){
                this.board[a][b].highlight = false
            }
        }
    }

    move_to_uci(p1,p2){
        let uci = this.dic[p1[0]]
        uci = uci.concat(8-p1[1],this.dic[p2[0]],8-p2[1])
        return uci
    }

    uci_to_move(UCI){
        let move = new Array(2);
        let p1 = new Array(2);
        let p2 = new Array(2);
        p1[0] = this.dic[UCI[0]]
        p1[1] = 8-parseInt(UCI[1])
        move[0] = (p1)

        p2[0] = this.dic[UCI[2]]
        p2[1] = 8-parseInt(UCI[3])
        move[1] = (p2)

        return move
    }

    update(Array){
        for (var a = 0; a < 8;a++){
            for(var b = 0;b < 8; b++){
                if (this.board[b][a].sym != Array[a][b]){
                    switch(Array[a][b]){
                        case 'p':
                            this.board[b][a] = new pawn('black',black_pawn_img,block_size)
                            break;
                        case 'P':
                            this.board[b][a] = new pawn('white',white_pawn_img,block_size)
                            break;
                        case 'r':
                            this.board[b][a] = new rook('black',black_rook_img,block_size)
                            break;
                        case 'R':
                            this.board[b][a] = new rook('white',white_rook_img,block_size)
                            break;
                        case 'n':
                            this.board[b][a] = new knight('black',black_knight_img,block_size)
                            break;
                        case 'N':
                            this.board[b][a] = new knight('white',white_knight_img,block_size)
                            break;
                        case 'b':
                            this.board[b][a] = new bishop('black',black_bishop_img,block_size)
                            break;
                        case 'B':
                            this.board[b][a] = new bishop('white',white_bishop_img,block_size)
                            break;
                        case 'q':
                            this.board[b][a] = new queen('black',black_queen_img,block_size)
                            break;
                        case 'Q':
                            this.board[b][a] = new queen('white',white_queen_img,block_size)
                            break;
                        case 'k':
                            this.board[b][a] = new king('black',black_king_img,block_size)
                            break;
                        case 'K':
                            this.board[b][a] = new king('white',white_king_img,block_size)
                            break; 
                        default:
                            this.board[b][a] = new piece()
                    }
                    this.board[b][a].x = b*this.block_size;
                    this.board[b][a].y = a*this.block_size;
                }
            }
        }
    }
}

class piece { 
    constructor(color = "blank",id = 0,score = 0,image = null,block_size) {

        console.assert(score >= 0,{score: score,errorMsg: "invalid score (score < 0)"})
        console.assert(id <= 6 && id >= 0,{id: id,errorMsg: "invalid piece id ( 0 <= id <= 6)"})
        
        var val = 0
        if (color == "white"){
            val = -1
        }
        else if (color == "black"){
            val = 1
        }
        else if (color == "blank"){
            val = 0
        }
        else{
            console.assert(true,{color: color,errorMsg: "invalid color (color != white or black or blank)"})
        }
        this.block_size = block_size
        this.image = image
        this.color = color
        this.val = val
        this.id = id*val
        this.score = score
        this.name = "blank"
        this.x = 0
        this.y = 0
        this.highlight = false
        this.sym = '.'
    }

    draw(ctx,pieces=true){
        if(this.highlight){
            ctx.fillStyle = 'black';
            ctx.strokeRect(this.x+2,this.y+2,this.block_size-2,this.block_size-2);
        }
        if(this.image != null && pieces){
            ctx.drawImage(this.image,this.x,this.y,this.block_size,this.block_size) 
        }
    }
}

class pawn extends piece{
    constructor(color,img = null,block_size){
        super(color,1,1,img,block_size)
        this.moved = false;
        this.name = "pawn"
        if (this.color == 'black'){
            this.sym = "p"
        }
        else if (this.color == 'white'){
            this.sym = "P"
        }
    }
    
}

class rook extends piece{
    constructor(color,img = null,block_size){
        super(color,2,5,img,block_size)
        this.moved = false;
        this.name = "rook"
        if (this.color == 'black'){
            this.sym = "r"
        }
        else if (this.color == 'white'){
            this.sym = "R"
        }
    }
}

class knight extends piece{
    constructor(color,img = null,block_size){
        super(color,3,3,img,block_size)
        this.name = "knight"
        if (this.color == 'black'){
            this.sym = "n"
        }
        else if (this.color == 'white'){
            this.sym = "N"
        }
    }
}

class bishop extends piece{
    constructor(color,img = null,block_size){
        super(color,4,3,img,block_size)
        this.name = "bishop"
        if (this.color == 'black'){
            this.sym = "b"
        }
        else if (this.color == 'white'){
            this.sym = "B"
        }
    }
}

class queen extends piece{
    constructor(color,img = null,block_size){
        super(color,5,9,img,block_size)
        this.name = "queen"
        if (this.color == 'black'){
            this.sym = "q"
        }
        else if (this.color == 'white'){
            this.sym = "Q"
        }
    }
}

class king extends piece{
    constructor(color,img = null,block_size){
        super(color,6,0,img,block_size)
        this.moved = false;
        this.name = "king"
        if (this.color == 'black'){
            this.sym = "k"
        }
        else if (this.color == 'white'){
            this.sym = "K"
        }
    }
}
