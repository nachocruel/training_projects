class Player:
    def __init__(self, name:str, sign:str):
        self.name = name
        self.sign = sign
        
        
class Game:
    def __init__(self, rows:int, cols:int, player1:Player, player2:Player):
        self.rows = rows
        self.cols = cols
        self.index = 0
        self.players = [player1, player2]
        self.matrix = [['' for _ in range(cols)] for _ in range(rows)]
    
    '''
        * init the matrix
        * 2 players
        * player 1 use sign 'X' and player2 the sign 'O'
        * request the player 1 insert X somewhere in the matrix
        * request the player 2 to insert 9 somewhere in the matrix
        * to chech we to know if one of the pleyers make sequece of 4 horizontaly, verticaly or diagonal
    '''
    
    def start(self):
        while(True):
            print(f'### It is {self.players[self.index].name} turn ###\n')
            col = self.select_column()
            row = self.select_insert_row(col)
            if row < 0:
                print('select another column, the selected one if full.')
                
            if self.is_player_winner(row, col):
                print(f'player {self.players[self.index].name} won the game')
                self.print_matrix()
                break
            
            if self.is_full():
                print('draw game')
                self.print_matrix()
                break
                
        
    def select_column(self) -> int:
        while(True):
            self.print_matrix()
            col = input('Select a column: ')
            try:
                col = int(col)
                if col > self.cols:
                    print(f'Column invalid, columns shoud be lower than or equal {self.cols}')
                    continue
                return col - 1
            except ValueError:
                print(f"Error: '{col}' is not a valid integer string.")
            except:
                print(f"Error was not possible convert to int")
                
    def select_insert_row(self, col):
        for row in reversed(range(self.rows)):
            if(not self.matrix[row][col]):
                return row
        return -1
        
        
    def is_player_winner(self, row:int, col:int)-> bool:
        self.matrix[row][col] = self.players[self.index].sign
        # verify horizontal match
        for row in self.matrix:
            if self.players[self.index].sign * 4 in ''.join(row):
                return True
            
        # verify vertical match
        init_col = 0
        current_col = []
        while init_col < self.cols:
            for row in self.matrix:
                current_col.append(row[init_col])
            if self.players[self.index].sign * 4 in ''.join(current_col):
                return True
            init_col+=1
            current_col = []
            
        # verify diagonal
        current_diag=[]
        count_row = 0
        while count_row < self.rows:
            init_col = 0
            while init_col < self.cols:
                current_diag.append(self.matrix[count_row][init_col])
                init_col+=1
            count_row+=1
            if self.players[self.index].sign * 4 in ''.join(current_diag):
                return True
            
        self.index = 0 if self.index == 1 else 1
        return False
    
    def is_full(self) -> bool:
        count = 0
        for row in self.matrix:
            for item in row:
                if not item:
                    count+=1
        return count == 0
    
    def print_matrix(self):
        for row in self.matrix:
            print(row)
            print('\n')
    
    
if __name__ == '__main__':
    player1 = Player('José', 'X')
    player2 = Player('Maria', 'O')
    rows = 6
    cols = 7
    game = Game(rows, cols, player1=player1, player2=player2)
    game.start()
        
        
        
        
        