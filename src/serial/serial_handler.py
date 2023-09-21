from turtle import end_fill
from enum import Enum
import serial.tools.list_ports
import serial
import serial.threaded
import random

class rx_state(Enum):
    FINDING_1ST_FLAG        = 1
    FINDING_2ND_FLAG        = 2
    FINDIND_PACKET_LENGTH   = 3
    FINDING_MSB_CAN_ID      = 4
    FINDING_LSB_CAN_ID      = 5
    PROCESS_PACKET         = 6

class serial_handler:
    def __init__(self):
        self.__available_ports  = []
        self.__rx_state         = rx_state.FINDING_1ST_FLAG
        self.__packet_length    = 0
        self.__can_id           = 0
        self.__rx_buffer        = []
        self.__rx_packet_count    = 0

    def generate_psuedo_data(self):
        tx_buffer = []
        tx_buffer.append(0x33) # starting flag
        tx_buffer.append(0x17)
        tx_buffer.append(0x08) # packet length
        tx_buffer.append(0x01) # can id
        tx_buffer.append(0x02)
        for i in range(0, 8):
            val = random.randint(0, 255)
            tx_buffer.append(val)

        return tx_buffer

    #Gets all the available ports
    def get_available_port(self):
        self.ports = serial.tools.list_ports.comports()

        for port in sorted(self.ports):
            self.__available_ports.append(port.device)

        return self.__available_ports 

    #Opens the port at the specified baudrate
    def open_port(self, Port, BaudRate):
        self.ser = serial.Serial(Port, BaudRate, timeout=0.1) 
        a = serial.threaded.LineReader()

    #Closes the port
    def close_port(self):
        self.ser.close()
        self.ser.__del__()

    #Reads a line and correctly formats suchs as removing \r\n
    def read(self):
        if self.ser.in_waiting:
            rx_byte = self.read_byte()
            #print(hex(data))

            if self.__rx_state == rx_state.FINDING_1ST_FLAG:
                if rx_byte == 0x33:
                    self.__rx_state = rx_state.FINDING_2ND_FLAG

            elif self.__rx_state == rx_state.FINDING_2ND_FLAG:
                if rx_byte == 0x17:
                    self.__rx_state  = rx_state.FINDIND_PACKET_LENGTH
                    self.__rx_buffer = [] #clear buffer

            elif self.__rx_state == rx_state.FINDIND_PACKET_LENGTH:
                self.__rx_buffer.append(rx_byte)
                self.__packet_length = rx_byte
                self.__rx_state      = rx_state.FINDING_MSB_CAN_ID

            elif self.__rx_state == rx_state.FINDING_MSB_CAN_ID:
                self.__rx_buffer.append(rx_byte)
                self.__can_id   = (rx_byte << 8)
                self.__rx_state = rx_state.FINDING_LSB_CAN_ID


            elif self.__rx_state == rx_state.FINDING_LSB_CAN_ID:
                self.__rx_buffer.append(rx_byte)
                self.__can_id   |= rx_byte
                self.__rx_state = rx_state.PROCESS_PACKET
                
            elif self.__rx_state == rx_state.PROCESS_PACKET:
                self.__rx_packet_count += 1
                self.__rx_buffer.append(rx_byte)
                if self.__rx_packet_count >= self.__packet_length-2:
                    self.__rx_state = rx_state.FINDING_1ST_FLAG
                    self.__rx_packet_count = 0

                    # remember to check crc16
                    return self.__can_id, self.__rx_buffer[3:-2] #return can_id and data

            else:
                self.__rx_state = rx_state.FINDING_1ST_FLAG
                self.__rx_packet_count   = 0
                self.__packet_length     = 0
        return None, None
    def read_byte(self):
        in_bin = self.ser.read(1)
        return int.from_bytes(in_bin,byteorder='little')

if __name__ == "__main__":
    d = serial_handler()
    print(d.get_available_port())
    #com = input("Enter port: ")
    d.open_port('COM3', 57600)
    try:
        while True:
            #d.read())
            can_id, data = d.read()
            if can_id == 0x257  :
                print(hex(can_id), end=' ')
                for i in data:
                    print(hex(i), end=' ')
                print(' ')
            #d.read()
    except KeyboardInterrupt:
        d.close_port()
        pass

#d = Serial_Emulator()
#print(d.get_available_port())