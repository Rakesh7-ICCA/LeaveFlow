// See https://aka.ms/new-console-template for more information

int time = int.Parse(Console.ReadLine());
for(int i = 1; i<=time; i++)
{
    int x= 0, y=0, diff = 0;
    string[] str = Console.ReadLine().Split();
    x  = int.Parse(str[0]);
    y  = int.Parse(str[1]);
    

    string res1 = Convert.ToString(x, 2);
    string res2 = Convert.ToString(y, 2);

    int len = res1.Length<res2.Length?res1.Length:res2.Length;
    len--;
    while(len != 0)
    {
        diff = res1[len] == res2[len]?diff:++diff;
        len--;
    }
    Console.Write(diff);

}
